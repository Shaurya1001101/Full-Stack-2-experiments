const SIZE = 40;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RingGauge({ count, limit, size = SIZE }) {
  const ratio = limit > 0 ? Math.min(count / limit, 1) : 0;
  const overLimit = count > limit;
  const dashOffset = CIRCUMFERENCE * (1 - ratio);

  let stateClass = "ring-gauge--ok";
  if (overLimit) stateClass = "ring-gauge--over";
  else if (ratio > 0.9) stateClass = "ring-gauge--warn";

  return (
    <svg
      className={`ring-gauge ${stateClass}`}
      width={size}
      height={size}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={`${count} of ${limit} characters used`}
    >
      <circle
        className="ring-gauge__track"
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        strokeWidth={STROKE}
        fill="none"
      />
      <circle
        className="ring-gauge__fill"
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        strokeWidth={STROKE}
        fill="none"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
      />
    </svg>
  );
}
