import { getMonthMatrix, formatDateKey, isSameDay, addMonths } from "./dateUtils";

describe("formatDateKey", () => {
  test("formats a date as YYYY-MM-DD", () => {
    const date = new Date(2026, 8, 5); // Sept 5, 2026 (month is 0-indexed)
    expect(formatDateKey(date)).toBe("2026-09-05");
  });

  test("pads single-digit months and days", () => {
    const date = new Date(2026, 0, 1); // Jan 1, 2026
    expect(formatDateKey(date)).toBe("2026-01-01");
  });
});

describe("isSameDay", () => {
  test("returns true for the same calendar day at different times", () => {
    const a = new Date(2026, 8, 5, 3, 0);
    const b = new Date(2026, 8, 5, 23, 59);
    expect(isSameDay(a, b)).toBe(true);
  });

  test("returns false for different days", () => {
    const a = new Date(2026, 8, 5);
    const b = new Date(2026, 8, 6);
    expect(isSameDay(a, b)).toBe(false);
  });
});

describe("addMonths", () => {
  test("rolls over into the next year", () => {
    const date = new Date(2026, 11, 15); // December 2026
    const result = addMonths(date, 1);
    expect(result.getFullYear()).toBe(2027);
    expect(result.getMonth()).toBe(0); // January
  });
});

describe("getMonthMatrix", () => {
  test("every week row has exactly 7 days", () => {
    const weeks = getMonthMatrix(2026, 8); // September 2026
    weeks.forEach((week) => {
      expect(week).toHaveLength(7);
    });
  });

  test("includes all days of the target month marked currentMonth=true", () => {
    const weeks = getMonthMatrix(2026, 8); // September 2026 has 30 days
    const currentMonthDays = weeks
      .flat()
      .filter((cell) => cell.currentMonth);
    expect(currentMonthDays).toHaveLength(30);
  });

  test("pads leading/trailing days from adjacent months", () => {
    const weeks = getMonthMatrix(2026, 8);
    const allCells = weeks.flat();
    const paddedDays = allCells.filter((cell) => !cell.currentMonth);
    // September 2026 doesn't start on Sunday or end on Saturday,
    // so there should be some padding on at least one side.
    expect(paddedDays.length).toBeGreaterThan(0);
  });
});
