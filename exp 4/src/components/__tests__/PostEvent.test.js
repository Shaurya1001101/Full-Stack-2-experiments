import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostEvent from "../PostEvent";

const samplePost = {
  id: "abc",
  title: "Launch announcement",
  content: "Details",
  date: "2026-09-20",
  time: "10:30",
  color: "#4f46e5",
};

test("renders the post title and time", () => {
  render(<PostEvent post={samplePost} onClick={() => {}} onDragStart={() => {}} />);
  expect(screen.getByText("Launch announcement")).toBeInTheDocument();
  expect(screen.getByText("10:30")).toBeInTheDocument();
});

test("calls onClick with the post when clicked", () => {
  const handleClick = jest.fn();
  render(<PostEvent post={samplePost} onClick={handleClick} onDragStart={() => {}} />);
  fireEvent.click(screen.getByText("Launch announcement"));
  expect(handleClick).toHaveBeenCalledWith(samplePost);
});

test("is draggable", () => {
  render(<PostEvent post={samplePost} onClick={() => {}} onDragStart={() => {}} />);
  const chip = screen.getByTitle("Launch announcement — 10:30");
  expect(chip).toHaveAttribute("draggable", "true");
});
