import { getPlatform } from "../data/platforms";

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SentLog({ entries }) {
  if (entries.length === 0) return null;

  return (
    <section className="sent-log">
      <h2 className="sent-log__title">Sent this session</h2>
      <ul className="sent-log__list">
        {entries.map((entry) => (
          <li key={entry.id} className="sent-log__item">
            <span className="sent-log__time">{formatTime(entry.sentAt)}</span>
            <span className="sent-log__text">{entry.text}</span>
            <span className="sent-log__platforms">
              {entry.platformIds.map((id) => {
                const platform = getPlatform(id);
                if (!platform) return null;
                return (
                  <span
                    key={id}
                    className="sent-log__dot"
                    style={{ background: platform.color }}
                    title={platform.name}
                  />
                );
              })}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
