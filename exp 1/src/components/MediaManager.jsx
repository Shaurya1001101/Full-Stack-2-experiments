import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMedia, removeMedia, selectDraft } from "../features/composer/composerSlice";

export default function MediaManager() {
  const dispatch = useDispatch();
  const { media } = useSelector(selectDraft);
  const [url, setUrl] = useState("");

  const handleAdd = () => {
    if (url.trim() === "") return;
    dispatch(addMedia(url.trim()));
    setUrl("");
  };

  return (
    <div className="media-manager">
      <div className="media-manager__row">
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
        <ul className="media-manager__list">
          {media.map((item) => (
            <li key={item.id} className="media-manager__thumb">
              <img src={item.url} alt="" onError={(e) => (e.target.style.opacity = 0.15)} />
              <button
                type="button"
                className="media-manager__remove"
                aria-label="Remove media"
                onClick={() => dispatch(removeMedia(item.id))}
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
