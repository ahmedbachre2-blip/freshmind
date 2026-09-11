import type { ExpirationStatus } from "./types";

export function daysUntil(expirationDate: string, now = new Date()): number {
  const expiry = new Date(`${expirationDate}T00:00:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = expiry.getTime() - today.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function statusFromDays(days: number): ExpirationStatus {
  if (days <= 3) return "urgente";
  if (days <= 7) return "pronto";
  return "ok";
}

export function formatDaysLabel(days: number): string {
  if (days < 0) {
    const n = Math.abs(days);
    return n === 1 ? "Caducó hace 1 día" : `Caducó hace ${n} días`;
  }
  if (days === 0) return "Caduca hoy";
  if (days === 1) return "Caduca mañana";
  return `${days} días`;
}

export function isoDateOffset(daysFromToday: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromToday);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
