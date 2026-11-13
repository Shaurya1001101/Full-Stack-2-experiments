import RingGauge from "./RingGauge";

export default function PlatformDetail({ platform, draft, result }) {
  const { text, media } = draft;
  const { charCount, remaining, valid, errors, warnings } = result;

  return (
    <div className="platform-detail">
      <div className="platform-detail__header">
        <div className="platform-detail__identity">
          <span
            className="platform-detail__mono"
            style={{ borderColor: platform.color, color: platform.color }}
          >
            {platform.monogram}
          </span>
          <div>
            <div className="platform-detail__name">{platform.name}</div>
            <div className="platform-detail__handle">{platform.handle}</div>
          </div>
        </div>

        <div className="platform-detail__gauge">
          <RingGauge count={charCount} limit={platform.charLimit} size={48} />
          <div className="platform-detail__count">
            <span className="platform-detail__count-num">{charCount}</span>
            <span className="platform-detail__count-limit">
              / {platform.charLimit}
            </span>
            <span
              className={`platform-detail__count-remaining ${
                remaining < 0 ? "is-over" : ""
              }`}
            >
              {remaining < 0
                ? `${Math.abs(remaining)} over`
                : `${remaining} left`}
            </span>
          </div>
        </div>
      </div>

      <div className="platform-detail__preview">
        {text.trim() === "" && media.length === 0 ? (
          <p className="platform-detail__placeholder">
            Your post will appear here as you type…
          </p>
        ) : (
          <>
            <p className="platform-detail__preview-text">{text}</p>
            {media.length > 0 && (
              <div className="platform-detail__preview-media">
                {media.slice(0, platform.maxMedia).map((m) => (
                  <img
                    key={m.id}
                    src={m.url}
                    alt=""
                    onError={(e) => (e.target.style.opacity = 0.1)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className={`platform-detail__status ${valid ? "is-valid" : "is-invalid"}`}>
        {valid ? "Ready to publish" : "Needs attention"}
      </div>

      {(errors.length > 0 || warnings.length > 0) && (
        <ul className="platform-detail__messages">
          {errors.map((msg, i) => (
            <li key={`e${i}`} className="message message--error">
              {msg}
            </li>
          ))}
          {warnings.map((msg, i) => (
            <li key={`w${i}`} className="message message--warn">
              {msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
