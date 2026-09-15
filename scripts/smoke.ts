/**
 * Critical-path smoke test.
 *
 * Exercises the business logic that would be expensive to get wrong, against a
 * real database: cart pricing, server-side price authority, stock limits, the
 * order transaction, the stock race guard, and the B2B enquiry path.
 *
 * Run with: npm run smoke   (requires DATABASE_URL and a migrated database)
 *
 * Every row it creates is removed again at the end.
 */
import { PrismaClient, OrderStatus } from "@prisma/client";
import { priceCart } from "../lib/server/pricing";
import { createOrder } from "../lib/server/orders";
import { createInquiry } from "../lib/server/inquiries";
import { checkoutSchema } from "../lib/validation/checkout";
import { DELIVERY_FEE_MINOR } from "../lib/server/settings";

const prisma = new PrismaClient();

let failures = 0;
const createdOrderNumbers: string[] = [];
const createdProductIds: string[] = [];
const createdInquiryIds: string[] = [];

function check(name: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  PASS  ${name}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function main() {
  console.log("\nIcePlease critical-path smoke test\n");

  // --- Fixtures ------------------------------------------------------------
  const stamp = Date.now();
  const cheap = await prisma.product.create({
    data: {
      slug: `smoke-cheap-${stamp}`,
      name: "Smoke Test Cheap",
      flavor: "Test",
      description: "Temporary product created by the smoke test.",
      priceMinor: 10000,
      packSize: "Tray of 12 cubes",
      stock: 5,
      isActive: true,
    },
  });
  const inactive = await prisma.product.create({
    data: {
      slug: `smoke-inactive-${stamp}`,
      name: "Smoke Test Inactive",
      flavor: "Test",
      description: "Temporary product created by the smoke test.",
      priceMinor: 20000,
      packSize: "Tray of 12 cubes",
      stock: 5,
      isActive: false,
    },
  });
  const scarce = await prisma.product.create({
    data: {
      slug: `smoke-scarce-${stamp}`,
      name: "Smoke Test Scarce",
      flavor: "Test",
      description: "Temporary product created by the smoke test.",
      priceMinor: 50000,
      packSize: "Tray of 12 cubes",
      stock: 1,
      isActive: true,
    },
  });
  createdProductIds.push(cheap.id, inactive.id, scarce.id);

  // --- Pricing -------------------------------------------------------------
  console.log("Cart pricing");

  const priced = await priceCart([{ productId: cheap.id, quantity: 2 }]);
  check(
    "subtotal comes from the database, not the request",
    priced.subtotalMinor === 20000,
    `got ${priced.subtotalMinor}`,
  );
  check(
    "total = subtotal + delivery fee",
    priced.totalMinor === priced.subtotalMinor + priced.deliveryFeeMinor,
  );
  check(
    "delivery fee matches the configured rule",
    priced.deliveryFeeMinor === DELIVERY_FEE_MINOR,
    `got ${priced.deliveryFeeMinor}`,
  );

  const withInactive = await priceCart([{ productId: inactive.id, quantity: 1 }]);
  check(
    "inactive product is dropped from the cart",
    withInactive.isEmpty && withInactive.issues[0]?.severity === "removed",
  );

  const overStock = await priceCart([{ productId: cheap.id, quantity: 99 }]);
  check(
    "quantity is clamped to available stock",
    overStock.lines[0]?.quantity === 5,
    `got ${overStock.lines[0]?.quantity}`,
  );

  const duplicated = await priceCart([
    { productId: cheap.id, quantity: 2 },
    { productId: cheap.id, quantity: 2 },
  ]);
  check(
    "duplicate lines are collapsed into one",
    duplicated.lines.length === 1 && duplicated.lines[0].quantity === 4,
  );

  const unknown = await priceCart([{ productId: "does-not-exist", quantity: 1 }]);
  check("unknown product id is rejected", unknown.isEmpty);

  // --- Order creation ------------------------------------------------------
  console.log("\nOrder creation");

  const checkoutInput = checkoutSchema.parse({
    customerName: "Smoke Test",
    customerEmail: "smoke@example.invalid",
    customerPhone: "9000000000",
    addressLine1: "1 Smoke Test Road",
    city: "Bengaluru",
    postalCode: "560001",
    paymentMethod: "CASH_ON_DELIVERY",
    lines: [{ productId: cheap.id, quantity: 2 }],
  });

  const created = await createOrder(checkoutInput, null);
  createdOrderNumbers.push(created.orderNumber);

  const order = await prisma.order.findUniqueOrThrow({
    where: { orderNumber: created.orderNumber },
    include: { items: true },
  });

  check("order persists", Boolean(order));
  check(
    "order total is server-calculated",
    order.totalMinor === 20000 + order.deliveryFeeMinor,
    `got ${order.totalMinor}`,
  );
  check("order starts PENDING", order.status === OrderStatus.PENDING);
  check("payment starts PENDING", order.paymentStatus === "PENDING");
  check(
    "order item snapshots the purchase-time price",
    order.items[0]?.unitPriceMinor === 10000,
  );
  check(
    "order item snapshots the product name and pack",
    order.items[0]?.productName === "Smoke Test Cheap" &&
      order.items[0]?.packSize === "Tray of 12 cubes",
  );

  const afterOrder = await prisma.product.findUniqueOrThrow({
    where: { id: cheap.id },
  });
  check("stock is decremented", afterOrder.stock === 3, `got ${afterOrder.stock}`);

  // A price change must not rewrite an order that already exists.
  await prisma.product.update({
    where: { id: cheap.id },
    data: { priceMinor: 99900 },
  });
  const reread = await prisma.orderItem.findFirstOrThrow({
    where: { orderNumber: created.orderNumber },
  });
  check(
    "changing the product price does not change a placed order",
    reread.unitPriceMinor === 10000,
  );

  // --- Stock race ----------------------------------------------------------
  console.log("\nStock race");

  const raceInput = checkoutSchema.parse({
    ...checkoutInput,
    lines: [{ productId: scarce.id, quantity: 1 }],
  });

  const results = await Promise.allSettled([
    createOrder(raceInput, null),
    createOrder(raceInput, null),
  ]);
  for (const result of results) {
    if (result.status === "fulfilled") {
      createdOrderNumbers.push(result.value.orderNumber);
    }
  }
  const fulfilled = results.filter((r) => r.status === "fulfilled").length;
  const scarceAfter = await prisma.product.findUniqueOrThrow({
    where: { id: scarce.id },
  });
  check(
    "two simultaneous orders for the last unit: exactly one succeeds",
    fulfilled === 1,
    `${fulfilled} succeeded`,
  );
  check("stock never goes negative", scarceAfter.stock === 0, `got ${scarceAfter.stock}`);

  // --- B2B enquiry ---------------------------------------------------------
  console.log("\nB2B enquiry");

  const inquiry = await createInquiry({
    businessName: "Smoke Test Cafe",
    businessType: "CAFE",
    contactPerson: "Smoke Test",
    phone: "9000000000",
    email: "smoke-b2b@example.invalid",
    city: "Bengaluru",
    location: "Test Street",
    estimatedQuantity: "100 cubes a week",
    preferredFlavors: "Test",
    message: "Created by the smoke test.",
  });
  createdInquiryIds.push(inquiry.id);

  const storedInquiry = await prisma.b2BInquiry.findUniqueOrThrow({
    where: { id: inquiry.id },
  });
  check("enquiry persists", Boolean(storedInquiry));
  check("enquiry starts NEW", storedInquiry.status === "NEW");

  console.log(
    failures === 0
      ? "\nAll critical paths passed.\n"
      : `\n${failures} check(s) failed.\n`,
  );
}

async function cleanup() {
  await prisma.order.deleteMany({
    where: { orderNumber: { in: createdOrderNumbers } },
  });
  await prisma.b2BInquiry.deleteMany({
    where: { id: { in: createdInquiryIds } },
  });
  await prisma.orderItem.deleteMany({
    where: { productId: { in: createdProductIds } },
  });
  await prisma.product.deleteMany({ where: { id: { in: createdProductIds } } });
}

main()
  .catch((error) => {
    failures += 1;
    console.error("\nSmoke test threw:", error);
  })
  .then(cleanup)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(failures === 0 ? 0 : 1);
  });
