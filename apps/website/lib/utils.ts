import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeTicketNumber(ticket: string): string {
  const trimmed = ticket.trim();
  // Remove leading zeros but keep single '0'
  return trimmed.replace(/^0+/, "") || "0";
}

export function extractNumericTicket(ticket: string): string | null {
  const digits = ticket.replace(/\D/g, "");
  return digits.length > 0 ? digits : null;
}

export function isNumericTicket(ticket: string): boolean {
  return /^\d+$/.test(ticket.trim());
}
