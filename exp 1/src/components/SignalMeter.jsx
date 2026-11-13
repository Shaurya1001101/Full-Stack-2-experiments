const SEGMENTS = 24;

export default function SignalMeter({ count, limit }) {
  const ratio = limit > 0 ? Math.min(count / limit, 1.25) : 0;
  const filledSegments = Math.round(Math.min(ratio, 1) * SEGMENTS);
  const overLimit = count > limit;

  let state = "ok";
  if (overLimit) state = "over";
  else if (ratio > 0.9) state = "warn";

  return (
    <div className={`signal-meter signal-meter--${state}`}>
      <div className="signal-meter__bars" aria-hidden="true">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <span
            key={i}
            className={`signal-meter__bar ${
              i < filledSegments ? "is-filled" : ""
            }`}
          />
        ))}
      </div>
      <span className="signal-meter__readout">
        {count}
        <span className="signal-meter__limit">/{limit}</span>
      </span>
    </div>
  );
}
