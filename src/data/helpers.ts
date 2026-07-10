/**
 * Tiny deterministic mock-data helpers. No backend, no faker dependency — just
 * enough to fill tables convincingly and reproducibly (seeded PRNG so the demo
 * looks the same on every reload).
 */
let seed = 20251121;
function rng(): number {
  // Mulberry32
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function resetSeed(s = 20251121) {
  seed = s;
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function int(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function bool(trueRatio = 0.8): boolean {
  return rng() < trueRatio;
}

export function pad(n: number, width = 2): string {
  return String(n).padStart(width, '0');
}

/** A timestamp string like "2025-11-21 16:32", walking backwards from a base. */
export function timeSeries(index: number, base = '2025-11-21T16:48:00'): string {
  const d = new Date(base);
  d.setMinutes(d.getMinutes() - index * int(1, 6));
  const p = (x: number) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(
    d.getHours(),
  )}:${p(d.getMinutes())}`;
}

export const PITS = ['01 - NORTH', '03 - NORTH', '89', 'PITCT', '90 - SOUTH'] as const;
export const TABLES = [
  'CTBB03',
  '01BB01',
  '01BB02',
  '03BB01',
  '90BB06',
  '12BB05',
  '89BB33',
] as const;
export const MACHINES = [
  'DT008857',
  'DT000011',
  'DT008585',
  'KAMENG-A',
  'KEI-INSYS',
  'MINGBO-INSYS',
  'NICK-INSYS-64',
] as const;
