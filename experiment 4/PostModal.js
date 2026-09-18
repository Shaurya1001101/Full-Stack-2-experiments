import React, { useState, useEffect } from "react";

const COLORS = ["#4f46e5", "#059669", "#d97706", "#dc2626", "#0891b2", "#7c3aed"];

/**
 * Modal for creating a new post or viewing/editing/deleting an existing one.
 */
export default function PostModal({ dateKey, post, onSave, onDelete, onClose }) {
  const isEditing = Boolean(post);
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [time, setTime] = useState(post?.time || "09:00");
  const [color, setColor] = useState(post?.color || COLORS[0]);

  useEffect(() => {
    setTitle(post?.title || "");
    setContent(post?.content || "");
    setTime(post?.time || "09:00");
    setColor(post?.color || COLORS[0]);
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: post?.id,
      title: title.trim(),
      content: content.trim(),
      date: post?.date || dateKey,
      time,
      color,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? "Edit post" : "Schedule a post"}</h2>
        <p className="modal-date">{post?.date || dateKey}</p>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              autoFocus
            />
          </label>
          <label>
            Content
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What is this post about?"
              rows={3}
            />
          </label>
          <label>
            Time
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
          <div className="modal-colors">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                className={"color-swatch" + (color === c ? " color-swatch--active" : "")}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                aria-label={`Choose color ${c}`}
              />
            ))}
          </div>
          <div className="modal-actions">
            {isEditing && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => onDelete(post.id)}
              >
                Delete
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Save changes" : "Add post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
