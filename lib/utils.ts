import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "Mango Chilli" -> "mango-chilli" */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Fixed so a server in UTC and a browser in India render the same time.
const TIME_ZONE = "Asia/Kolkata";

const DATE_FORMAT = new Intl.DateTimeFormat("en-IN", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-IN", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function formatDate(date: Date): string {
  return DATE_FORMAT.format(date);
}

export function formatDateTime(date: Date): string {
  return DATE_TIME_FORMAT.format(date);
}
