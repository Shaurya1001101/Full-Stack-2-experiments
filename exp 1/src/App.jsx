import { usePostComposer } from "./hooks/usePostComposer";
import PlatformPicker from "./components/PlatformPicker";
import PlatformTabs from "./components/PlatformTabs";
import PlatformDetail from "./components/PlatformDetail";
import MediaAttachments from "./components/MediaAttachments";
import SentLog from "./components/SentLog";
import "./App.css";

function App() {
  const {
    allPlatforms,
    text,
    setText,
    media,
    addMedia,
    removeMedia,
    selectedPlatformIds,
    selectedPlatforms,
    togglePlatform,
    activeTabId,
    setActiveTabId,
    results,
    canPublish,
    publishState,
    publish,
    sentLog,
  } = usePostComposer();

  const activePlatform = selectedPlatforms.find((p) => p.id === activeTabId);
  const draft = { text, media };

  return (
    <div className="page">
      <header className="page__header">
        <div className="page__eyebrow">Post Composer</div>
        <h1 className="page__title">One draft. Every platform's own rules.</h1>
        <p className="page__sub">
          Select where it's going, write once, and open each tab to see its
          live character count, media rules, and warnings.
        </p>
      </header>

      <section className="card">
        <PlatformPicker
          platforms={allPlatforms}
          selectedIds={selectedPlatformIds}
          onToggle={togglePlatform}
        />

        <textarea
          className="composer-textarea"
          placeholder="What do you want to say?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
        />

        <MediaAttachments media={media} onAdd={addMedia} onRemove={removeMedia} />
      </section>

      {selectedPlatforms.length === 0 ? (
        <div className="empty-state">
          Choose at least one platform above to see its live constraints.
        </div>
      ) : (
        <section className="card card--tabs">
          <PlatformTabs
            platforms={selectedPlatforms}
            activeTabId={activeTabId}
            onSelectTab={setActiveTabId}
            results={results}
          />
          {activePlatform && (
            <PlatformDetail
              platform={activePlatform}
              draft={draft}
              result={results[activePlatform.id]}
            />
          )}
        </section>
      )}

      <div className="publish-row">
        <button
          type="button"
          className="btn btn--primary"
          disabled={!canPublish}
          onClick={publish}
        >
          {publishState === "publishing"
            ? "Publishing…"
            : publishState === "done"
            ? "Published ✓"
            : `Publish to ${selectedPlatforms.length || ""} platform${
                selectedPlatforms.length === 1 ? "" : "s"
              }`}
        </button>
      </div>

      <SentLog entries={sentLog} />
    </div>
  );
}

export default App;
