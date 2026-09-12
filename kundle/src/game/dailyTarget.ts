import type { Client } from '../types';

/**
 * Deterministic daily target selection.
 * The same calendar date always maps to the same target, with no backend required.
 * Swap this for a database-backed lookup later without touching game logic.
 */

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDailyTarget(eligibleClients: Client[], date: Date = new Date()): Client {
  if (eligibleClients.length === 0) {
    throw new Error('No eligible clients configured for the daily target.');
  }
  const dateKey = date.toISOString().slice(0, 10); // YYYY-MM-DD
  const index = hashString(dateKey) % eligibleClients.length;
  return eligibleClients[index];
}
