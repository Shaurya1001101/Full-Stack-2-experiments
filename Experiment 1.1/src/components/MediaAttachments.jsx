import { useState } from "react";

export default function MediaAttachments({ media, onAdd, onRemove }) {
  const [url, setUrl] = useState("");

  const handleAdd = () => {
    if (url.trim() === "") return;
    onAdd(url);
    setUrl("");
  };

  return (
    <div className="media-attachments">
      <div className="media-attachments__row">
        <input
          type="text"
          className="text-input"
          placeholder="Paste an image URL to attach media…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button type="button" className="btn btn--ghost" onClick={handleAdd}>
          Attach
        </button>
      </div>

      {media.length > 0 && (
        <ul className="media-attachments__list">
          {media.map((item) => (
            <li key={item.id} className="media-attachments__thumb">
              <img
                src={item.url}
                alt=""
                onError={(e) => (e.target.style.opacity = 0.15)}
              />
              <button
                type="button"
                className="media-attachments__remove"
                aria-label="Remove media"
                onClick={() => onRemove(item.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
