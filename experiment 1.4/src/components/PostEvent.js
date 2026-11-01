import React from "react";

/**
 * A single scheduled post rendered inside a day cell.
 *
 * Wrapped in React.memo (Experiment 1.4.2): this component only
 * re-renders when its own `post` object or callbacks change, not on
 * every calendar re-render caused by unrelated state updates.
 */
function PostEvent({ post, onClick, onDragStart }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", post.id);
    e.dataTransfer.effectAllowed = "move";
    onDragStart(post.id);
  };

  return (
    <div
      className="post-event"
      style={{ backgroundColor: post.color }}
      draggable
      onDragStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onClick(post);
      }}
      title={`${post.title} — ${post.time}`}
    >
      <span className="post-event-time">{post.time}</span>
      <span className="post-event-title">{post.title}</span>
    </div>
  );
}

export default React.memo(PostEvent);
