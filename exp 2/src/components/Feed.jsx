import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllPosts } from "../features/posts/postsSlice";
import { PLATFORMS } from "../data/platforms";
import PostGroupCard from "./PostGroupCard";

export default function Feed() {
  const posts = useSelector(selectAllPosts);
  const [filter, setFilter] = useState("all");

  const groups = useMemo(() => {
    const filtered =
      filter === "all" ? posts : posts.filter((p) => p.platformId === filter);

    const byGroup = new Map();
    filtered.forEach((post) => {
      if (!byGroup.has(post.groupId)) byGroup.set(post.groupId, []);
      byGroup.get(post.groupId).push(post);
    });

    return Array.from(byGroup.entries()).sort(
      (a, b) => new Date(b[1][0].createdAt) - new Date(a[1][0].createdAt)
    );
  }, [posts, filter]);

  const activePlatformIds = useMemo(
    () => new Set(posts.map((p) => p.platformId)),
    [posts]
  );

  return (
    <div className="feed">
      <header className="view-header">
        <div className="view-header__eyebrow">02 · Feed</div>
        <h1 className="view-header__title">What's gone out.</h1>
        <p className="view-header__sub">
          Every published draft, grouped by broadcast, filterable by channel.
        </p>
      </header>

      <div className="feed__filters">
        <button
          className={`filter-pill ${filter === "all" ? "is-active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        {PLATFORMS.filter((p) => activePlatformIds.has(p.id)).map((platform) => (
          <button
            key={platform.id}
            className={`filter-pill ${filter === platform.id ? "is-active" : ""}`}
            onClick={() => setFilter(platform.id)}
            style={
              filter === platform.id ? { borderColor: platform.color, color: platform.color } : undefined
            }
          >
            {platform.name}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <div className="empty-state">
          <p>Nothing published yet. Head to Compose to send your first broadcast.</p>
        </div>
      ) : (
        <div className="feed__list">
          {groups.map(([groupId, groupPosts]) => (
            <PostGroupCard key={groupId} groupId={groupId} posts={groupPosts} />
          ))}
        </div>
      )}
    </div>
  );
}
