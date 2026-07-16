import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return `${siteConfig.currencySymbol}${amount.toLocaleString("en-NG")}`;
}

export function generateOrderReference(prefix = "EP") {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
