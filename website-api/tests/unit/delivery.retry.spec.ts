import { describe, expect, it } from "vitest";
import { calculateRetryDelayMs } from "../../src/delivery/delivery.processor";

describe("calculateRetryDelayMs", () => {
  it("uses exponential backoff from the first failed attempt", () => {
    expect(calculateRetryDelayMs(1, 30_000, 3_600_000)).toBe(30_000);
    expect(calculateRetryDelayMs(2, 30_000, 3_600_000)).toBe(60_000);
    expect(calculateRetryDelayMs(3, 30_000, 3_600_000)).toBe(120_000);
  });

  it("caps the retry delay", () => {
    expect(calculateRetryDelayMs(20, 30_000, 3_600_000)).toBe(3_600_000);
  });
});
