const ARTICLES = [
  { id: 'a-1', title: 'Zero-downtime deploys', body: 'Published notes on a blue-green rollout.' },
  { id: 'a-2', title: 'Token refresh strategy', body: 'Published outline for sliding-expiry refresh tokens.' },
];

export default function ViewerPage() {
  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">Open to every role</p>
        <h1 className="page__title">Viewer Area</h1>
        <p className="page__lede">Read-only content, reachable by Viewer, Editor, and Admin alike.</p>
      </header>

      <section className="card-list">
        {ARTICLES.map((article) => (
          <article key={article.id} className="card">
            <h2 className="card__title">{article.title}</h2>
            <p className="card__hint">{article.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
