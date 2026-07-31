import SignalMeter from "./SignalMeter";

export default function PlatformComposerCard({ platform, draft, result }) {
  const { text, media } = draft;
  const { charCount, errors, warnings, valid } = result;

  return (
    <div
      className={`platform-card ${valid ? "" : "platform-card--invalid"}`}
      style={{ "--platform-color": platform.color }}
    >
      <div className="platform-card__header">
        <span
          className="platform-card__mono"
          style={{ borderColor: platform.color, color: platform.color }}
        >
          {platform.monogram}
        </span>
        <div>
          <div className="platform-card__name">{platform.name}</div>
          <div className="platform-card__handle">{platform.handle}</div>
        </div>
        <span
          className={`platform-card__status ${valid ? "is-valid" : "is-invalid"}`}
        >
          {valid ? "Ready" : "Needs fixes"}
        </span>
      </div>

      <div className="platform-card__preview">
        <p className="platform-card__preview-text">
          {text.trim() === "" ? (
            <span className="platform-card__placeholder">
              Your post will appear here…
            </span>
          ) : (
            text
          )}
        </p>
        {media.length > 0 && (
          <div className="platform-card__preview-media">
            {media.slice(0, platform.maxMedia).map((m) => (
              <img key={m.id} src={m.url} alt="" onError={(e) => (e.target.style.opacity = 0.1)} />
            ))}
          </div>
        )}
      </div>

      <SignalMeter count={charCount} limit={platform.charLimit} />

      {(errors.length > 0 || warnings.length > 0) && (
        <ul className="platform-card__messages">
          {errors.map((msg, i) => (
            <li key={`e${i}`} className="platform-card__message platform-card__message--error">
              {msg}
            </li>
          ))}
          {warnings.map((msg, i) => (
            <li key={`w${i}`} className="platform-card__message platform-card__message--warn">
              {msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
