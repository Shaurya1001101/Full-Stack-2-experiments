import React, { useState, useCallback } from "react";
import PostEvent from "./PostEvent";
import { formatDateKey, isSameDay } from "../utils/dateUtils";

/**
 * Renders one day cell in the month grid: the date number, any posts
 * scheduled for that day, an "add" affordance, and drag-and-drop
 * handling so posts can be rescheduled by dropping them here.
 *
 * React.memo (Experiment 1.4.2) skips re-rendering a day cell whose
 * own posts/props haven't changed, even while other cells update.
 */
function DayCell({
  date,
  currentMonth,
  posts,
  onDayClick,
  onEventClick,
  onDropPost,
}) {
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
          <PostEvent
            key={post.id}
            post={post}
            onClick={onEventClick}
            onDragStart={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

function areEqual(prev, next) {
  return (
    prev.currentMonth === next.currentMonth &&
    formatDateKey(prev.date) === formatDateKey(next.date) &&
    prev.posts === next.posts &&
    prev.onDayClick === next.onDayClick &&
    prev.onEventClick === next.onEventClick &&
    prev.onDropPost === next.onDropPost
  );
}

export default React.memo(DayCell, areEqual);
