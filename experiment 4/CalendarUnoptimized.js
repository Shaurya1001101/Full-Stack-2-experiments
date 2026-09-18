import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DayCellBase from "./DayCellBase";
import PostEventBase from "./PostEventBase";
import PostModal from "./PostModal";
import { useRenderCount } from "../hooks/useRenderCount";
import {
  addPost,
  updatePost,
  deletePost,
  movePost,
  selectAllPosts,
} from "../store/postsSlice";
import {
  getMonthMatrix,
  addMonths,
  formatDateKey,
  WEEKDAY_LABELS,
  MONTH_LABELS,
} from "../utils/dateUtils";

/**
 * The "non-optimal" calendar (Experiment 1.4.2 — the "before" state).
 *
 * Same UI and behavior as Calendar.js, but deliberately skips every
 * optimization:
 *   - `weeks` and `postsByDate` are recomputed from scratch on every
 *     render instead of being cached with useMemo.
 *   - Every handler is a brand-new inline function on every render
 *     instead of a stable useCallback reference.
 *   - Day cells and post chips (`DayCellBase`/`PostEventBase`) are
 *     rendered directly, with no React.memo, so they re-execute their
 *     render function on every Calendar re-render regardless of
 *     whether their own props actually changed.
 *
 * The net effect: an unrelated update (`tick`, standing in for
 * something like a live clock or notification badge elsewhere in a
 * real app) forces every day cell and every post chip to re-render,
 * even though nothing about the posts or the visible month changed.
 * The Render Optimizer panel counts exactly this.
 */
export default function CalendarUnoptimized({ tick = 0 }) {
  useRenderCount("Calendar:non-optimal");
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [modalState, setModalState] = useState(null); // { dateKey, post } | null

  // No useMemo: this grid + regrouping work runs fresh on every render,
  // even ones caused by `tick` that have nothing to do with the month
  // or the posts.
  const weeks = getMonthMatrix(visibleMonth.getFullYear(), visibleMonth.getMonth());

  const postsByDate = {};
  for (const post of posts) {
    if (!postsByDate[post.date]) postsByDate[post.date] = [];
    postsByDate[post.date].push(post);
  }

  // No useCallback: every one of these is a new function reference on
  // every render, so even a memoized child would see "changed" props.
  const handlePrevMonth = () => setVisibleMonth((m) => addMonths(m, -1));
  const handleNextMonth = () => setVisibleMonth((m) => addMonths(m, 1));
  const handleToday = () => {
    const now = new Date();
    setVisibleMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };
  const handleDayClick = (dateKey) => setModalState({ dateKey, post: null });
  const handleEventClick = (post) => setModalState({ dateKey: post.date, post });
  const handleDropPost = (dateKey, postId) => {
    dispatch(movePost({ id: postId, date: dateKey }));
  };
  const handleSave = (data) => {
    if (data.id) {
      dispatch(updatePost({ id: data.id, changes: data }));
    } else {
      dispatch(addPost(data));
    }
    setModalState(null);
  };
  const handleDelete = (id) => {
    dispatch(deletePost(id));
    setModalState(null);
  };
  const closeModal = () => setModalState(null);

  return (
    <div className="calendar" data-tick={tick}>
      <div className="calendar-toolbar">
        <div className="calendar-nav">
          <button className="btn btn-secondary" onClick={handlePrevMonth}>
            &larr;
          </button>
          <button className="btn btn-secondary" onClick={handleToday}>
            Today
          </button>
          <button className="btn btn-secondary" onClick={handleNextMonth}>
            &rarr;
          </button>
        </div>
        <h1 className="calendar-title">
          {MONTH_LABELS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
          <span className="mode-badge mode-badge--non-optimal">non-optimal</span>
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => setModalState({ dateKey: formatDateKey(new Date()), post: null })}
        >
          + New post
        </button>
      </div>

      <div className="calendar-weekday-row">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="calendar-weekday">
            {label}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {weeks.map((week, wi) => (
          <div className="calendar-week" key={wi}>
            {week.map(({ date, currentMonth }) => {
              const dateKey = formatDateKey(date);
              return (
                <DayCellBase
                  key={dateKey}
                  date={date}
                  currentMonth={currentMonth}
                  posts={postsByDate[dateKey] || []}
                  onDayClick={handleDayClick}
                  onEventClick={handleEventClick}
                  onDropPost={handleDropPost}
                  mode="non-optimal"
                  EventComponent={PostEventBase}
                />
              );
            })}
          </div>
        ))}
      </div>

      {modalState && (
        <PostModal
          dateKey={modalState.dateKey}
          post={modalState.post}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
