/* Rank ladder + board-literal pricing for SEA Climbforge.
 *
 * The ladder runs weakest-first: Iron 4 … Iron 1, Bronze 4 … Diamond 1,
 * Master. Every calculator estimate and every rank validation derives
 * from this order.
 *
 * Step pricing follows the price board: inside a tier each division step
 * costs that tier's per-rank rate; a promotion step (X 1 → next tier)
 * costs the fixed promotion package — so full-tier climbs exactly match
 * the board.
 */

export const LADDER: string[] = [];
for (const tier of [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Emerald",
  "Diamond",
]) {
  for (const division of ["4", "3", "2", "1"]) {
    LADDER.push(`${tier} ${division}`);
  }
}
LADDER.push("Master");

export const PER_RANK_RATE: Record<string, number> = {
  Iron: 40,
  Bronze: 65,
  Silver: 80,
  Gold: 95,
  Platinum: 140,
  Emerald: 235,
  Diamond: 250,
};

export const PROMOTION_STEP: Record<string, number> = {
  "Iron 1": 60,
  "Bronze 1": 75,
  "Silver 1": 105,
  "Gold 1": 175,
  "Platinum 1": 220,
  "Emerald 1": 270,
  "Diamond 1": 300,
};

export const DUO_MULTIPLIER = 1.4;

export function stepCost(from: string): number {
  const promotion = PROMOTION_STEP[from];
  if (promotion !== undefined) return promotion;
  return PER_RANK_RATE[from.split(" ")[0]] ?? 0;
}

export function estimateClimb(
  current: string,
  target: string,
  duo: boolean,
): { steps: number; total: number } | null {
  const from = LADDER.indexOf(current);
  const to = LADDER.indexOf(target);
  if (from < 0 || to < 0 || from >= to) return null;
  let total = 0;
  for (let i = from; i < to; i += 1) {
    total += stepCost(LADDER[i]);
  }
  if (duo) total = Math.round(total * DUO_MULTIPLIER);
  return { steps: to - from, total };
}

export function rankErrorFor(current: string, target: string): string | null {
  if (current === "Master") {
    return "Master and above needs a manual quote. Message us on Facebook for the next step.";
  }
  const from = LADDER.indexOf(current);
  const to = LADDER.indexOf(target);
  if (from === to) {
    return "Current and target rank can't match — pick a higher target rank.";
  }
  if (from > to) {
    return "Target rank must be higher than your current rank.";
  }
  return null;
}

/* Staged climbs: the client's budget reaches `milestone` for now, the rest
 * later. Leg 1 (current → milestone) is due now, leg 2 (milestone → target)
 * before the final push. Each leg is transacted separately, so Duo rounds
 * per leg. A milestone equal to the target is just full payment. */
export function milestoneErrorFor(
  current: string,
  milestone: string,
  target: string,
): string | null {
  const from = LADDER.indexOf(current);
  const mid = LADDER.indexOf(milestone);
  const to = LADDER.indexOf(target);
  if (mid <= from) {
    return "First payment must cover at least one division above your current rank.";
  }
  if (mid > to) {
    return "“Pay up to” can't go past your target rank.";
  }
  return null;
}

export function estimateSplit(
  current: string,
  milestone: string,
  target: string,
  duo: boolean,
): {
  leg1: { steps: number; total: number };
  leg2: { steps: number; total: number } | null;
  total: number;
} | null {
  const leg1 = estimateClimb(current, milestone, duo);
  if (!leg1) return null;
  if (milestone === target) {
    return { leg1, leg2: null, total: leg1.total };
  }
  const leg2 = estimateClimb(milestone, target, duo);
  if (!leg2) return null;
  return { leg1, leg2, total: leg1.total + leg2.total };
}
