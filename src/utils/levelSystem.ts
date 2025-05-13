export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1; /* e.g., 0–99 = lvl 1, 100–199 = lvl 2 */
}
