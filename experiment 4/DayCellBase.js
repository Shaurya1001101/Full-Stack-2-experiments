import React, { useState, useCallback } from "react";
import PostEventBase from "./PostEventBase";
import { useRenderCount } from "../hooks/useRenderCount";
import { formatDateKey, isSameDay } from "../utils/dateUtils";

/**
 * Renders one day cell in the month grid: the date number, any posts
 * scheduled for that day, an "add" affordance, and drag-and-drop
 * handling so posts can be rescheduled by dropping them here.
 *
 * This is the *unmemoized* implementation. `DayCell.js` wraps it in
 * `React.memo` for the optimal calendar; `CalendarUnoptimized.js`
 * renders this component directly with no memoization, so it
 * re-executes on every calendar re-render even when its own props
 * (date, posts, handlers) haven't changed.
 *
 * `EventComponent` lets the caller choose which post-chip implementation
 * to render: the memoized `PostEvent` (optimal) or the raw
 * `PostEventBase` (non-optimal) — same JSX, different re-render behavior.
 */
function DayCellBase({
  date,
  currentMonth,
  posts,
  onDayClick,
  onEventClick,
  onDropPost,
  mode = "non-optimal",
  EventComponent = PostEventBase,
}) {
  const renderToken = useRenderCount(`DayCell:${mode}`);
  const [isDragOver, setIsDragOver] = useState(false);
  const dateKey = formatDateKey(date);
  const isToday = isSameDay(date, new Date());

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const postId = e.dataTransfer.getData("text/plain");
      if (postId) onDropPost(dateKey, postId);
    },
    [dateKey, onDropPost]
  );

  return (
    <div
      className={[
        "day-cell",
        currentMonth ? "" : "day-cell--muted",
        isToday ? "day-cell--today" : "",
        isDragOver ? "day-cell--drag-over" : "",
      ].join(" ").trim()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => onDayClick(dateKey)}
    >
      <span
        key={renderToken}
        className={`render-flash render-flash--${mode}`}
        aria-hidden="true"
      />
      <div className="day-cell-header">
        <span className="day-cell-number">{date.getDate()}</span>
        <button
          className="day-cell-add"
          onClick={(e) => {
            e.stopPropagation();
            onDayClick(dateKey);
          }}
          aria-label="Add post"
        >
          +
        </button>
      </div>
      <div className="day-cell-events">
        {posts.map((post) => (
          <EventComponent
            key={post.id}
            post={post}
            onClick={onEventClick}
            onDragStart={() => {}}
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
}

export function areEqual(prev, next) {
  return (
    prev.currentMonth === next.currentMonth &&
    formatDateKey(prev.date) === formatDateKey(next.date) &&
    prev.posts === next.posts &&
    prev.onDayClick === next.onDayClick &&
    prev.onEventClick === next.onEventClick &&
    prev.onDropPost === next.onDropPost
  );
}

export default DayCellBase;
