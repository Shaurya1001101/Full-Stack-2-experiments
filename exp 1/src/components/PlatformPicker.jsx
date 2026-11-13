export default function PlatformPicker({ platforms, selectedIds, onToggle }) {
  return (
    <div className="platform-picker" role="group" aria-label="Target platforms">
      {platforms.map((platform) => {
        const selected = selectedIds.includes(platform.id);
        return (
          <button
            key={platform.id}
            type="button"
            className={`platform-picker__item ${selected ? "is-selected" : ""}`}
            onClick={() => onToggle(platform.id)}
            aria-pressed={selected}
            title={platform.description}
          >
            <span
              className="platform-picker__check"
              style={{ borderColor: platform.color }}
            >
              {selected && (
                <svg viewBox="0 0 12 12" width="9" height="9">
                  <path
                    d="M1.5 6.2 4.4 9 10.5 2.2"
                    fill="none"
                    stroke={platform.color}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="platform-picker__label">{platform.name}</span>
            <span className="platform-picker__limit">{platform.charLimit}</span>
          </button>
        );
      })}
    </div>
  );
}
