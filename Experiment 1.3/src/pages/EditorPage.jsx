import { useState } from 'react';

const INITIAL_ARTICLES = [
  { id: 'a-1', title: 'Zero-downtime deploys', body: 'Draft notes on a blue-green rollout.' },
  { id: 'a-2', title: 'Token refresh strategy', body: 'Outline for sliding-expiry refresh tokens.' },
];

export default function EditorPage() {
  const [articles, setArticles] = useState(INITIAL_ARTICLES);

  function updateBody(id, body) {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, body } : a)));
  }

  function addArticle() {
    const id = `a-${articles.length + 1}-${Date.now()}`;
    setArticles((prev) => [...prev, { id, title: 'Untitled draft', body: '' }]);
  }

  function removeArticle(id) {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">Experiment 2 — Editor clearance</p>
        <h1 className="page__title">Editor Tools</h1>
        <p className="page__lede">
          Editors and Admins can reach this route. Viewers are redirected before this component
          ever renders.
        </p>
      </header>

      <section className="card-list">
        {articles.map((article) => (
          <article key={article.id} className="card">
            <div className="card__row">
              <h2 className="card__title">{article.title}</h2>
              <button type="button" className="btn btn--ghost btn--small" onClick={() => removeArticle(article.id)}>
                Delete
              </button>
            </div>
            <textarea
              className="field__input field__input--textarea"
              value={article.body}
              onChange={(e) => updateBody(article.id, e.target.value)}
              rows={3}
            />
          </article>
        ))}
        <button type="button" className="btn btn--secondary" onClick={addArticle}>
          + Add draft
        </button>
      </section>
    </div>
  );
}
