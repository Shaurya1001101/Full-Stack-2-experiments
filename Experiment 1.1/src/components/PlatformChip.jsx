export default function PlatformChip({ platform, selected, disabled, onClick }) {
  return (
    <button
      type="button"
      className={`platform-chip ${selected ? "is-selected" : ""} ${
        disabled ? "is-disabled" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      title={
        disabled
          ? `${platform.name} is disconnected — enable it in Channels`
          : platform.description
      }
    >
      <span
        className="platform-chip__mono"
        style={{ color: platform.color, borderColor: platform.color }}
      >
        {platform.monogram}
      </span>
      <span className="platform-chip__name">{platform.name}</span>
      <span className="platform-chip__limit">{platform.charLimit}</span>
    </button>
  );
}
