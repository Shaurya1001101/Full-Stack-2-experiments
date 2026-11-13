import { useDispatch, useSelector } from "react-redux";
import { PLATFORMS } from "../data/platforms";
import {
  selectConnectedMap,
  toggleConnection,
} from "../features/platforms/platformsSlice";

function DialMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <circle
        cx="11"
        cy="11"
        r="9"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.6"
      />
      <circle cx="11" cy="11" r="2.4" fill="var(--accent)" />
      <line
        x1="11"
        y1="11"
        x2="11"
        y2="3.4"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Sidebar({ activeView, onChangeView }) {
  const dispatch = useDispatch();
  const connected = useSelector(selectConnectedMap);

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <DialMark />
        <div>
          <div className="sidebar__brand-name">VITA</div>
          <div className="sidebar__brand-tag">dispatch console</div>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Primary">
        <button
          className={`sidebar__nav-item ${
            activeView === "compose" ? "is-active" : ""
          }`}
          onClick={() => onChangeView("compose")}
        >
          <span className="sidebar__nav-index">01</span>
          Compose
        </button>
        <button
          className={`sidebar__nav-item ${
            activeView === "feed" ? "is-active" : ""
          }`}
          onClick={() => onChangeView("feed")}
        >
          <span className="sidebar__nav-index">02</span>
          Feed
        </button>
      </nav>

      <div className="sidebar__channels">
        <div className="sidebar__section-label">Channels</div>
        <ul className="channel-list">
          {PLATFORMS.map((platform) => {
            const isOn = connected[platform.id];
            return (
              <li key={platform.id} className="channel-list__item">
                <span
                  className="channel-list__dot"
                  style={{ background: platform.color }}
                />
                <span className="channel-list__name">{platform.name}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isOn}
                  aria-label={`${isOn ? "Disconnect" : "Connect"} ${
                    platform.name
                  }`}
                  className={`switch ${isOn ? "is-on" : ""}`}
                  onClick={() => dispatch(toggleConnection(platform.id))}
                >
                  <span className="switch__thumb" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
