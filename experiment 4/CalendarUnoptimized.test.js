import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import CalendarUnoptimized from "../CalendarUnoptimized";
import postsReducer from "../../store/postsSlice";
import { MONTH_LABELS } from "../../utils/dateUtils";
import { resetStats, getStats } from "../../utils/renderStats";

function renderWithStore(preloadedPosts = [], props = {}) {
  const store = configureStore({
    reducer: { posts: postsReducer },
    preloadedState: { posts: preloadedPosts },
  });
  return render(
    <Provider store={store}>
      <CalendarUnoptimized {...props} />
    </Provider>
  );
}

beforeEach(() => {
  resetStats();
});

test("renders the current month and year in the title", () => {
  renderWithStore();
  const now = new Date();
  const expectedTitle = `${MONTH_LABELS[now.getMonth()]} ${now.getFullYear()}`;
  expect(screen.getByText(expectedTitle)).toBeInTheDocument();
});

test("renders a scheduled post on the calendar", () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  renderWithStore([
    { id: "1", title: "Test Post", content: "", date: `${y}-${m}-01`, time: "09:00", color: "#4f46e5" },
  ]);
  expect(screen.getByText("Test Post")).toBeInTheDocument();
});

test("navigating to next month changes the displayed title", () => {
  renderWithStore();
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  fireEvent.click(screen.getByText("→"));
  expect(
    screen.getByText(`${MONTH_LABELS[next.getMonth()]} ${next.getFullYear()}`)
  ).toBeInTheDocument();
});

test("clicking a day cell opens the new-post modal", () => {
  renderWithStore();
  const addButtons = screen.getAllByLabelText("Add post");
  fireEvent.click(addButtons[0]);
  expect(screen.getByText("Schedule a post")).toBeInTheDocument();
});

test("re-renders every day cell when an unrelated `tick` prop changes", () => {
  const store = configureStore({ reducer: { posts: postsReducer }, preloadedState: { posts: [] } });
  const { rerender, container } = render(
    <Provider store={store}>
      <CalendarUnoptimized tick={0} />
    </Provider>
  );
  const cellCountBefore = container.querySelectorAll(".day-cell").length;
  resetStats();

  rerender(
    <Provider store={store}>
      <CalendarUnoptimized tick={1} />
    </Provider>
  );

  const { counts } = getStats();
  // Every day cell currently on screen re-executed its render function,
  // since DayCellBase isn't memoized in the non-optimal calendar.
  expect(counts["DayCell:non-optimal"]).toBeGreaterThanOrEqual(cellCountBefore);
});
