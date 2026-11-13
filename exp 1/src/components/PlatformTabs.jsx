import RingGauge from "./RingGauge";

export default function PlatformTabs({
  platforms,
  activeTabId,
  onSelectTab,
  results,
}) {
  if (platforms.length === 0) return null;

  return (
    <div className="platform-tabs" role="tablist" aria-label="Selected platforms">
      {platforms.map((platform) => {
        const result = results[platform.id];
        const isActive = activeTabId === platform.id;
        return (
          <button
            key={platform.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`platform-tab ${isActive ? "is-active" : ""} ${
              result && !result.valid ? "has-error" : ""
            }`}
            onClick={() => onSelectTab(platform.id)}
          >
            <RingGauge
              size={22}
              count={result ? result.charCount : 0}
              limit={platform.charLimit}
            />
            <span className="platform-tab__mono" style={{ color: platform.color }}>
              {platform.monogram}
            </span>
            <span className="platform-tab__name">{platform.name}</span>
            {result && !result.valid && (
              <span className="platform-tab__flag" aria-hidden="true">
                !
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
