import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PLATFORMS, getPlatform } from "../data/platforms";
import {
  selectDraft,
  setText,
  togglePlatform,
  resetDraft,
} from "../features/composer/composerSlice";
import { selectConnectedMap } from "../features/platforms/platformsSlice";
import {
  publishPost,
  selectPostsStatus,
  selectPostsError,
} from "../features/posts/postsSlice";
import { validateForPlatforms } from "../utils/validation";
import PlatformChip from "./PlatformChip";
import PlatformComposerCard from "./PlatformComposerCard";
import MediaManager from "./MediaManager";

export default function Composer() {
  const dispatch = useDispatch();
  const draft = useSelector(selectDraft);
  const connected = useSelector(selectConnectedMap);
  const status = useSelector(selectPostsStatus);
  const error = useSelector(selectPostsError);

  const selectedPlatforms = useMemo(
    () => draft.selectedPlatformIds.map(getPlatform).filter(Boolean),
    [draft.selectedPlatformIds]
  );

  const { results, allValid } = useMemo(
    () => validateForPlatforms(selectedPlatforms, draft),
    [selectedPlatforms, draft]
  );

  const isLoading = status === "loading";
  const canPublish = allValid && selectedPlatforms.length > 0 && !isLoading;

  const handlePublish = () => {
    if (!canPublish) return;
    dispatch(publishPost({ draft, platforms: selectedPlatforms })).then(
      (action) => {
        if (publishPost.fulfilled.match(action)) {
          dispatch(resetDraft());
        }
      }
    );
  };

  return (
    <div className="composer">
      <header className="view-header">
        <div className="view-header__eyebrow">01 · Compose</div>
        <h1 className="view-header__title">One draft, every channel.</h1>
        <p className="view-header__sub">
          Pick where it airs — each channel checks itself against its own
          rules as you type.
        </p>
      </header>

      <section className="composer__panel">
        <div className="composer__platform-row">
          {PLATFORMS.map((platform) => (
            <PlatformChip
              key={platform.id}
              platform={platform}
              selected={draft.selectedPlatformIds.includes(platform.id)}
              disabled={!connected[platform.id]}
              onClick={() => dispatch(togglePlatform(platform.id))}
            />
          ))}
        </div>

        <textarea
          className="composer__textarea"
          placeholder="What do you want to say?"
          value={draft.text}
          onChange={(e) => dispatch(setText(e.target.value))}
          rows={5}
        />

        <MediaManager />
      </section>

      {selectedPlatforms.length === 0 ? (
        <div className="empty-state">
          <p>Select at least one connected channel above to see live rules.</p>
        </div>
      ) : (
        <section className="composer__grid">
          {selectedPlatforms.map((platform) => (
            <PlatformComposerCard
              key={platform.id}
              platform={platform}
              draft={draft}
              result={results[platform.id]}
            />
          ))}
        </section>
      )}

      <footer className="composer__footer">
        {error && <div className="banner banner--error">{error}</div>}
        <button
          type="button"
          className="btn btn--primary"
          disabled={!canPublish}
          onClick={handlePublish}
        >
          {isLoading
            ? "Publishing…"
            : `Publish to ${selectedPlatforms.length || ""} channel${
                selectedPlatforms.length === 1 ? "" : "s"
              }`}
        </button>
      </footer>
    </div>
  );
}
