/**
 * Development seed data.
 *
 * Everything created here is DEMO CONTENT. The flavors, prices, pack sizes and
 * descriptions below are placeholders chosen so the application can be
 * exercised end to end — they are not finalized IcePlease product facts.
 *
 * Every product is flagged `isSeedData: true`, which the admin catalogue
 * surfaces as a "Demo" badge, so nobody mistakes seed rows for real ones.
 * Replace them through the admin screens before going anywhere near customers.
 */
import { PrismaClient, Role, OrderStatus, PaymentStatus, InquiryStatus, BusinessType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateOrderNumber } from "../lib/order-number";

const prisma = new PrismaClient();

const SEED_PRODUCTS = [
  {
    slug: "demo-classic-lime",
    name: "Classic Lime",
    flavor: "Lime",
    tagline: "Sharp, clean, hard to get wrong.",
    description:
      "A straightforward citrus cube for sparkling water, iced tea and soda. Sharp on the first sip and steadier as it melts.",
    priceMinor: 19900,
    packSize: "Tray of 12 cubes",
    cubeCount: 12,
    accentColor: "#8ddc7a",
    stock: 48,
    isFeatured: true,
    sortOrder: 10,
  },
  {
    slug: "demo-alphonso-mango",
    name: "Alphonso Mango",
    flavor: "Mango",
    tagline: "Summer, in a cube.",
    description:
      "A rounder, sweeter cube built for plain water, lemonade and cold milk. Turns an ordinary glass into something worth finishing.",
    priceMinor: 24900,
    packSize: "Tray of 12 cubes",
    cubeCount: 12,
    accentColor: "#f6b93b",
    stock: 32,
    isFeatured: true,
    sortOrder: 20,
  },
  {
    slug: "demo-mint-cooler",
    name: "Mint Cooler",
    flavor: "Mint",
    tagline: "Cold twice over.",
    description:
      "Clean mint that lifts nimbu paani, mojitos and iced green tea. The flavor arrives slowly, so the last sip is the strongest.",
    priceMinor: 21900,
    packSize: "Tray of 12 cubes",
    cubeCount: 12,
    accentColor: "#6fe0be",
    stock: 40,
    isFeatured: true,
    sortOrder: 30,
  },
  {
    slug: "demo-cold-brew",
    name: "Cold Brew",
    flavor: "Coffee",
    tagline: "Ice that does not water down your coffee.",
    description:
      "A coffee cube for iced lattes and cold brew. As it melts it adds coffee rather than diluting what is already in the glass.",
    priceMinor: 27900,
    packSize: "Tray of 12 cubes",
    cubeCount: 12,
    accentColor: "#b07a4f",
    stock: 0,
    isFeatured: false,
    sortOrder: 40,
  },
  {
    slug: "demo-berry-crush",
    name: "Berry Crush",
    flavor: "Mixed berry",
    tagline: "For the glass that gets photographed.",
    description:
      "Deep berry colour that bleeds through the drink as it melts. Built for soda, prosecco and anything served in a clear glass.",
    priceMinor: 26900,
    packSize: "Tray of 12 cubes",
    cubeCount: 12,
    accentColor: "#e4739b",
    stock: 18,
    isFeatured: false,
    sortOrder: 50,
  },
  {
    slug: "demo-tasting-box",
    name: "Tasting Box",
    flavor: "Assorted",
    tagline: "Four flavors, one box.",
    description:
      "Three cubes each of four flavors. The simplest way to work out which one belongs in your fridge.",
    priceMinor: 44900,
    packSize: "Box of 12 cubes, 4 flavors",
    cubeCount: 12,
    accentColor: "#8fd8ee",
    stock: 24,
    isFeatured: true,
    sortOrder: 5,
  },
];

const SEED_INQUIRIES = [
  {
    businessName: "[Demo] Third Wave Coffee Lab",
    businessType: BusinessType.CAFE,
    contactPerson: "Demo Contact",
    phone: "0000000000",
    email: "demo-cafe@example.invalid",
    city: "Bengaluru",
    location: "Indiranagar",
    estimatedQuantity: "About 200 cubes a week",
    preferredFlavors: "Cold Brew, Mint Cooler",
    message:
      "Demo enquiry. Interested in coffee cubes for the iced menu, weekly delivery.",
    status: InquiryStatus.NEW,
  },
  {
    businessName: "[Demo] Rooftop & Co.",
    businessType: BusinessType.BAR,
    contactPerson: "Demo Contact",
    phone: "0000000000",
    email: "demo-bar@example.invalid",
    city: "Mumbai",
    location: "Bandra West",
    estimatedQuantity: "3 trays a day, weekends heavier",
    preferredFlavors: "Berry Crush, Classic Lime",
    message: "Demo enquiry. Looking at cocktails that change as they sit.",
    status: InquiryStatus.CONTACTED,
  },
  {
    businessName: "[Demo] Saffron Catering",
    businessType: BusinessType.CATERER,
    contactPerson: "Demo Contact",
    phone: "0000000000",
    email: "demo-catering@example.invalid",
    city: "Pune",
    location: "Koregaon Park",
    estimatedQuantity: "1200 cubes for a single event",
    preferredFlavors: "Alphonso Mango",
    message: "Demo enquiry. One-off wedding reception in the dry season.",
    status: InquiryStatus.QUOTED,
  },
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@iceplease.local";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "iceplease-dev";

  console.log("Seeding IcePlease development data...");

  // --- Admin ---------------------------------------------------------------
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: {
      email: adminEmail,
      name: "IcePlease Admin",
      role: Role.ADMIN,
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });
  console.log(`  admin      ${admin.email}`);

  // --- Demo customer -------------------------------------------------------
  const customer = await prisma.user.upsert({
    where: { email: "customer@iceplease.local" },
    update: {},
    create: {
      email: "customer@iceplease.local",
      name: "Demo Customer",
      phone: "9000000000",
      role: Role.CUSTOMER,
      passwordHash: await bcrypt.hash("iceplease-dev", 12),
      addressLine1: "12 Demo Street",
      city: "Bengaluru",
      postalCode: "560038",
    },
  });
  console.log(`  customer   ${customer.email}`);

  // --- Catalogue -----------------------------------------------------------
  for (const product of SEED_PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product, isSeedData: true },
      create: { ...product, isSeedData: true },
    });
  }
  console.log(`  products   ${SEED_PRODUCTS.length}`);

  // --- Demo orders ---------------------------------------------------------
  const existingOrders = await prisma.order.count();
  if (existingOrders === 0) {
    const lime = await prisma.product.findUniqueOrThrow({
      where: { slug: "demo-classic-lime" },
    });
    const mango = await prisma.product.findUniqueOrThrow({
      where: { slug: "demo-alphonso-mango" },
    });

    const deliveryFee = 4900;

    const orders = [
      {
        status: OrderStatus.DELIVERED,
        paymentStatus: PaymentStatus.PAID,
        lines: [
          { product: lime, quantity: 2 },
          { product: mango, quantity: 1 },
        ],
        daysAgo: 9,
      },
      {
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PENDING,
        lines: [{ product: mango, quantity: 3 }],
        daysAgo: 2,
      },
      {
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        lines: [{ product: lime, quantity: 1 }],
        daysAgo: 0,
      },
    ];

    for (const order of orders) {
      const subtotal = order.lines.reduce(
        (sum, line) => sum + line.product.priceMinor * line.quantity,
        0,
      );
      const createdAt = new Date(
        Date.now() - order.daysAgo * 24 * 60 * 60 * 1000,
      );
      await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: customer.id,
          customerName: customer.name ?? "Demo Customer",
          customerEmail: customer.email,
          customerPhone: customer.phone ?? "9000000000",
          addressLine1: "12 Demo Street",
          city: "Bengaluru",
          postalCode: "560038",
          subtotalMinor: subtotal,
          deliveryFeeMinor: deliveryFee,
          totalMinor: subtotal + deliveryFee,
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt,
          updatedAt: createdAt,
          items: {
            create: order.lines.map((line) => ({
              productId: line.product.id,
              productName: line.product.name,
              productFlavor: line.product.flavor,
              packSize: line.product.packSize,
              unitPriceMinor: line.product.priceMinor,
              quantity: line.quantity,
              lineTotalMinor: line.product.priceMinor * line.quantity,
            })),
          },
        },
      });
    }
    console.log(`  orders     ${orders.length} (demo)`);
  } else {
    console.log(`  orders     skipped, ${existingOrders} already present`);
  }

  // --- B2B enquiries -------------------------------------------------------
  const existingInquiries = await prisma.b2BInquiry.count();
  if (existingInquiries === 0) {
    await prisma.b2BInquiry.createMany({ data: SEED_INQUIRIES });
    console.log(`  enquiries  ${SEED_INQUIRIES.length} (demo)`);
  } else {
    console.log(`  enquiries  skipped, ${existingInquiries} already present`);
  }

  console.log("\nDone. Sign in at /login with:");
  console.log(`  ${adminEmail} / ${adminPassword}   (admin)`);
  console.log(`  customer@iceplease.local / iceplease-dev   (customer)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
