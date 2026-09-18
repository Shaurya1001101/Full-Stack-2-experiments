import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DayCellBase from "../DayCellBase";
import PostEventBase from "../PostEventBase";
import { resetStats, getStats } from "../../utils/renderStats";

const samplePost = {
  id: "p1",
  title: "Launch announcement",
  content: "",
  date: "2026-09-20",
  time: "10:30",
  color: "#4f46e5",
};

const baseProps = {
  date: new Date(2026, 8, 20),
  currentMonth: true,
  posts: [samplePost],
  onDayClick: () => {},
  onEventClick: () => {},
  onDropPost: () => {},
  EventComponent: PostEventBase,
};

beforeEach(() => {
  resetStats();
});

test("renders the day number and any scheduled posts", () => {
  render(<DayCellBase {...baseProps} mode="non-optimal" />);
  expect(screen.getByText("20")).toBeInTheDocument();
  expect(screen.getByText("Launch announcement")).toBeInTheDocument();
});

test("clicking the cell calls onDayClick with the date key", () => {
  const handleDayClick = jest.fn();
  render(<DayCellBase {...baseProps} onDayClick={handleDayClick} mode="non-optimal" />);
  fireEvent.click(screen.getByText("20"));
  expect(handleDayClick).toHaveBeenCalledWith("2026-09-20");
});

test("records a render under the given mode", () => {
  render(<DayCellBase {...baseProps} mode="optimal" />);
  const { counts } = getStats();
  expect(counts["DayCell:optimal"]).toBe(1);
  expect(counts["DayCell:non-optimal"]).toBeUndefined();
});
