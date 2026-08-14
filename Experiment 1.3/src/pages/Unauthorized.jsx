import { Link, useLocation } from 'react-router-dom';

export default function Unauthorized() {
  const location = useLocation();
  const required = location.state?.requiredRoles?.join(' or ');
  const held = location.state?.heldRole;

  return (
    <div className="page page--centered">
      <div className="card card--narrow">
        <p className="page__eyebrow">403</p>
        <h1 className="page__title">You don&apos;t have clearance for this area</h1>
        {required ? (
          <p className="page__lede">
            This route needs {required} clearance{held ? `, but your token is scoped to ${held}` : ''}.
          </p>
        ) : (
          <p className="page__lede">Your role doesn&apos;t permit access to this route.</p>
        )}
        <Link className="btn btn--primary" to="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
