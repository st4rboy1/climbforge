import { describe, expect, test } from "bun:test";
import {
  LADDER,
  estimateClimb,
  estimateSplit,
  milestoneErrorFor,
  rankErrorFor,
} from "../src/lib/pricing";

describe("rank ladder", () => {
  test("runs weakest-first across 29 rungs", () => {
    expect(LADDER).toHaveLength(29);
    expect(LADDER[0]).toBe("Iron 4");
    expect(LADDER[3]).toBe("Iron 1");
    expect(LADDER[4]).toBe("Bronze 4");
    expect(LADDER[27]).toBe("Diamond 1");
    expect(LADDER[28]).toBe("Master");
  });
});

describe("estimateClimb", () => {
  test("promotion legs match the board exactly", () => {
    expect(estimateClimb("Silver 1", "Gold 4", false)).toEqual({ steps: 1, total: 105 });
    expect(estimateClimb("Iron 1", "Bronze 4", false)).toEqual({ steps: 1, total: 60 });
    expect(estimateClimb("Diamond 1", "Master", false)).toEqual({ steps: 1, total: 300 });
  });

  test("mixes per-rank steps with package legs", () => {
    // Iron 4 → Iron 1 (3 × 40) + Iron 1 → Bronze 4 (60)
    expect(estimateClimb("Iron 4", "Bronze 4", false)).toEqual({ steps: 4, total: 180 });
  });

  test("applies the duo multiplier rounded to whole pesos", () => {
    expect(estimateClimb("Silver 1", "Gold 4", true)).toEqual({ steps: 1, total: 147 });
  });

  test("rejects flat or downhill climbs", () => {
    expect(estimateClimb("Gold 4", "Gold 4", false)).toBeNull();
    expect(estimateClimb("Gold 1", "Gold 4", false)).toBeNull();
    expect(estimateClimb("Master", "Master", false)).toBeNull();
  });
});

describe("estimateSplit", () => {
  test("splits a staged climb into due-now and due-later legs", () => {
    // Emerald 1 → Diamond 4 (270 package) + Diamond 4 → Master
    // (3 × 250 per-rank + 300 package) = 270 + 1050 = 1320.
    expect(estimateSplit("Emerald 1", "Diamond 4", "Master", false)).toEqual({
      leg1: { steps: 1, total: 270 },
      leg2: { steps: 4, total: 1050 },
      total: 1320,
    });
  });

  test("rounds the duo multiplier per leg", () => {
    expect(estimateSplit("Emerald 1", "Diamond 4", "Master", true)).toEqual({
      leg1: { steps: 1, total: 378 },
      leg2: { steps: 4, total: 1470 },
      total: 1848,
    });
  });

  test("a milestone equal to the target is full payment", () => {
    expect(estimateSplit("Silver 1", "Gold 4", "Gold 4", false)).toEqual({
      leg1: { steps: 1, total: 105 },
      leg2: null,
      total: 105,
    });
  });

  test("rejects a milestone at or below the current rank", () => {
    expect(estimateSplit("Gold 4", "Gold 4", "Platinum 4", false)).toBeNull();
    expect(estimateSplit("Gold 4", "Silver 1", "Platinum 4", false)).toBeNull();
  });
});

describe("milestoneErrorFor", () => {
  test("accepts a milestone between current and target", () => {
    expect(milestoneErrorFor("Emerald 1", "Diamond 4", "Master")).toBeNull();
    expect(milestoneErrorFor("Silver 1", "Gold 4", "Gold 4")).toBeNull();
  });

  test("rejects out-of-range milestones", () => {
    expect(milestoneErrorFor("Gold 4", "Gold 4", "Platinum 4")).toContain(
      "at least one division",
    );
    expect(milestoneErrorFor("Gold 4", "Silver 1", "Platinum 4")).toContain(
      "at least one division",
    );
    expect(milestoneErrorFor("Gold 4", "Diamond 4", "Platinum 4")).toContain(
      "past your target",
    );
  });
});
describe("rankErrorFor", () => {
  test("accepts a real climb", () => {
    expect(rankErrorFor("Silver 1", "Gold 4")).toBeNull();
  });

  test("rejects same, lower, and Master-current selections", () => {
    expect(rankErrorFor("Gold 4", "Gold 4")).toContain("can't match");
    expect(rankErrorFor("Platinum 4", "Gold 4")).toContain("higher than your current rank");
    expect(rankErrorFor("Master", "Master")).toContain("manual quote");
  });
});
