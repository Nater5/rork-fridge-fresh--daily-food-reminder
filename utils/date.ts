export function toISODate(input: Date): string {
  const y = input.getFullYear();
  const m = String(input.getMonth() + 1).padStart(2, "0");
  const d = String(input.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isValidISODate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}

export function daysUntil(dateISO: string): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(dateISO).getTime();
  const diff = target - start;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function friendlyExpiry(dateISO: string): { label: string; tone: "ok" | "soon" | "urgent" | "past" } {
  const d = daysUntil(dateISO);
  if (d < 0) return { label: "Expired", tone: "past" };
  if (d === 0) return { label: "Expires today", tone: "urgent" };
  if (d <= 2) return { label: `In ${d} day${d === 1 ? "" : "s"}`, tone: "soon" };
  return { label: `In ${d} days`, tone: "ok" };
}