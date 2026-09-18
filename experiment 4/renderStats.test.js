import { recordRender, getStats, resetStats } from "./renderStats";

describe("renderStats", () => {
  beforeEach(() => {
    resetStats();
  });

  test("recordRender increments the count for a key", () => {
    recordRender("DayCell:optimal");
    recordRender("DayCell:optimal");
    recordRender("DayCell:non-optimal");

    const { counts } = getStats();
    expect(counts["DayCell:optimal"]).toBe(2);
    expect(counts["DayCell:non-optimal"]).toBe(1);
  });

  test("getStats returns a snapshot, not a live reference", () => {
    recordRender("Calendar:optimal");
    const snapshot = getStats();
    recordRender("Calendar:optimal");

    expect(snapshot.counts["Calendar:optimal"]).toBe(1);
    expect(getStats().counts["Calendar:optimal"]).toBe(2);
  });

  test("recordRender appends an entry to the log with an increasing seq", () => {
    recordRender("PostEvent:optimal");
    recordRender("PostEvent:non-optimal");

    const { log } = getStats();
    expect(log).toHaveLength(2);
    expect(log[0].key).toBe("PostEvent:optimal");
    expect(log[1].key).toBe("PostEvent:non-optimal");
    expect(log[1].seq).toBeGreaterThan(log[0].seq);
  });

  test("resetStats clears both counts and the log", () => {
    recordRender("Calendar:optimal");
    resetStats();

    const { counts, log } = getStats();
    expect(counts).toEqual({});
    expect(log).toEqual([]);
  });
});
