import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { decodeToken } from '../auth/jwt';
import { request } from '../auth/apiClient';
import TokenBadge from '../components/TokenBadge';

function useCountdown(exp) {
  const [remaining, setRemaining] = useState(() => Math.max(0, exp * 1000 - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, exp * 1000 - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [exp]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function Dashboard() {
  const { token, user } = useAuth();
  const decoded = useMemo(() => (token ? decodeToken(token) : null), [token]);
  const countdown = useCountdown(user?.exp ?? Math.floor(Date.now() / 1000));

  const [apiResult, setApiResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    request('/api/profile').then((result) => {
      if (!cancelled) setApiResult(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">Experiment 1 — Authentication</p>
        <h1 className="page__title">Welcome back, {user?.name}</h1>
        <p className="page__lede">
          You&apos;re signed in with a stateless session — no server-side session store, just a
          signed token your browser presents on every request.
        </p>
      </header>

      <section className="grid grid--2">
        <div className="card">
          <h2 className="card__title">Your token</h2>
          <p className="card__hint">
            Decoded client-side to show its three parts. The signature is checked again on every
            protected request — see the request log alongside it.
          </p>
          <TokenBadge decoded={decoded} />
          <div className="stat-row">
            <div>
              <p className="stat-row__label">Expires in</p>
              <p className="stat-row__value stat-row__value--mono">{countdown}</p>
            </div>
            <div>
              <p className="stat-row__label">Algorithm</p>
              <p className="stat-row__value stat-row__value--mono">{decoded?.header.alg}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card__title">Attach-token request</h2>
          <p className="card__hint">
            Mounting this page fires a simulated <code>GET /api/profile</code> call. The
            Authorization header carries the bearer token, and a mock server verifies it before
            responding.
          </p>
          {apiResult ? (
            <div className={`request-log ${apiResult.ok ? 'request-log--ok' : 'request-log--fail'}`}>
              <p className="request-log__status">
                {apiResult.status} {apiResult.ok ? 'OK' : 'Rejected'}
              </p>
              {apiResult.ok ? (
                <pre className="request-log__body">{JSON.stringify(apiResult.data, null, 2)}</pre>
              ) : (
                <p className="request-log__body">{apiResult.error}</p>
              )}
            </div>
          ) : (
            <p className="card__hint">Sending request…</p>
          )}
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">Where this token can go next</h2>
        <p className="card__hint">Role-based routing decides what you can reach from here.</p>
        <ul className="checklist">
          <li>Viewer Area — open to every signed-in role</li>
          <li>Editor Tools — requires Editor or Admin</li>
          <li>Admin Panel — requires Admin</li>
        </ul>
      </section>
    </div>
  );
}
