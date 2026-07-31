import { useDispatch } from "react-redux";
import { getPlatform } from "../data/platforms";
import { deleteGroup } from "../features/posts/postsSlice";

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostGroupCard({ groupId, posts }) {
  const dispatch = useDispatch();
  const first = posts[0];

  return (
    <article className="post-group">
      <div className="post-group__top">
        <span className="post-group__time">{formatTime(first.createdAt)}</span>
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => dispatch(deleteGroup(groupId))}
        >
          Delete
        </button>
      </div>

      <p className="post-group__text">{first.text}</p>

      {first.media.length > 0 && (
        <div className="post-group__media">
          {first.media.map((m) => (
            <img key={m.id} src={m.url} alt="" onError={(e) => (e.target.style.opacity = 0.1)} />
          ))}
        </div>
      )}

      <div className="post-group__channels">
        {posts.map((post) => {
          const platform = getPlatform(post.platformId);
          if (!platform) return null;
          return (
            <span
              key={post.id}
              className="channel-pill"
              style={{ borderColor: platform.color, color: platform.color }}
            >
              {platform.name}
            </span>
          );
        })}
      </div>
    </article>
  );
}
