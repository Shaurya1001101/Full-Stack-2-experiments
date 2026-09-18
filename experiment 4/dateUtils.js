// Temporal data modeling helpers for the calendar (Experiment 1.4.1)

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Formats a Date object as a stable, timezone-safe "YYYY-MM-DD" key.
 * Using local getters (not toISOString) avoids UTC off-by-one-day bugs.
 */
export function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isSameDay(a, b) {
  return formatDateKey(a) === formatDateKey(b);
}

export function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

/**
 * Builds a full 7-column week grid for the given year/month, padded with
 * the trailing days of the previous month and the leading days of the
 * next month so every week row has exactly 7 cells.
 *
 * Returns an array of weeks; each week is an array of
 * { date: Date, currentMonth: boolean } cells.
 */
export function getMonthMatrix(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  // Padding: trailing days of previous month
  for (let i = startDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    cells.push({ date: new Date(year, month - 1, day), currentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), currentMonth: true });
  }

  // Padding: leading days of next month, until full weeks
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(year, month + 1, nextDay), currentMonth: false });
    nextDay += 1;
  }

  // Group into week rows
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function offsetDateKey(daysFromToday) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return formatDateKey(d);
}
