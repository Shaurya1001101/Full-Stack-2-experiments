import React, { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DayCell from "./DayCell";
import PostModal from "./PostModal";
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

export default function Calendar() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [modalState, setModalState] = useState(null); // { dateKey, post } | null

  // Expensive-ish computation (grid + regrouping) memoized so it only
  // recomputes when the month or the underlying posts actually change
  // (Experiment 1.4.2: useMemo to avoid unnecessary recalculation).
  const weeks = useMemo(
    () => getMonthMatrix(visibleMonth.getFullYear(), visibleMonth.getMonth()),
    [visibleMonth]
  );

  const postsByDate = useMemo(() => {
    const map = {};
    for (const post of posts) {
      if (!map[post.date]) map[post.date] = [];
      map[post.date].push(post);
    }
    return map;
  }, [posts]);

  // Stable callback references (useCallback) so memoized DayCell/PostEvent
  // children don't re-render just because Calendar re-rendered.
  const handlePrevMonth = useCallback(() => {
    setVisibleMonth((m) => addMonths(m, -1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setVisibleMonth((m) => addMonths(m, 1));
  }, []);

  const handleToday = useCallback(() => {
    const now = new Date();
    setVisibleMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  }, []);

  const handleDayClick = useCallback((dateKey) => {
    setModalState({ dateKey, post: null });
  }, []);

  const handleEventClick = useCallback((post) => {
    setModalState({ dateKey: post.date, post });
  }, []);

  const handleDropPost = useCallback(
    (dateKey, postId) => {
      dispatch(movePost({ id: postId, date: dateKey }));
    },
    [dispatch]
  );

  const handleSave = useCallback(
    (data) => {
      if (data.id) {
        dispatch(updatePost({ id: data.id, changes: data }));
      } else {
        dispatch(addPost(data));
      }
      setModalState(null);
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id) => {
      dispatch(deletePost(id));
      setModalState(null);
    },
    [dispatch]
  );

  const closeModal = useCallback(() => setModalState(null), []);

  return (
    <div className="calendar">
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
                <DayCell
                  key={dateKey}
                  date={date}
                  currentMonth={currentMonth}
                  posts={postsByDate[dateKey] || []}
                  onDayClick={handleDayClick}
                  onEventClick={handleEventClick}
                  onDropPost={handleDropPost}
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
