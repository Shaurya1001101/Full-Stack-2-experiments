import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import RenderOptimizerPanel from "../RenderOptimizerPanel";
import { resetStats, recordRender } from "../../utils/renderStats";

function setup(overrides = {}) {
  const props = {
    mode: "optimal",
    onModeChange: jest.fn(),
    simulate: false,
    onSimulateChange: jest.fn(),
    onForceTick: jest.fn(),
    tick: 0,
    ...overrides,
  };
  render(<RenderOptimizerPanel {...props} />);
  return props;
}

beforeEach(() => {
  resetStats();
});

test("clicking 'Non-optimal' calls onModeChange with the new mode", () => {
  const props = setup();
  fireEvent.click(screen.getByRole("button", { name: "Non-optimal" }));
  expect(props.onModeChange).toHaveBeenCalledWith("non-optimal");
});

test("toggling the auto-tick switch calls onSimulateChange", () => {
  const props = setup();
  fireEvent.click(screen.getByLabelText("Auto-tick every 1s"));
  expect(props.onSimulateChange).toHaveBeenCalledWith(true);
});

test("'Force one tick' calls onForceTick", () => {
  const props = setup();
  fireEvent.click(screen.getByText("Force one tick"));
  expect(props.onForceTick).toHaveBeenCalled();
});

test("shows the current tick count", () => {
  setup({ tick: 7 });
  expect(screen.getByText("7")).toBeInTheDocument();
});

test("the active mode button is marked pressed", () => {
  setup({ mode: "non-optimal" });
  expect(screen.getByRole("button", { name: "Optimal" })).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByRole("button", { name: "Non-optimal" })).toHaveAttribute("aria-pressed", "true");
});

test("displays recorded render counts in the stats table", () => {
  recordRender("DayCell:optimal");
  recordRender("DayCell:optimal");
  recordRender("DayCell:non-optimal");
  setup();

  const row = screen.getByRole("cell", { name: "DayCell" }).closest("tr");
  const cells = within(row).getAllByRole("cell");
  expect(cells[1]).toHaveTextContent("1"); // non-optimal count
  expect(cells[2]).toHaveTextContent("2"); // optimal count
});
