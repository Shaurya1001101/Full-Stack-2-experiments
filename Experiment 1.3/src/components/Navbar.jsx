import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import RoleBadge from './RoleBadge';

// Each link declares which roles may see it — this is the "dynamically
// render UI elements based on permissions" requirement from Experiment 2.
const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', roles: ['Admin', 'Editor', 'Viewer'] },
  { to: '/viewer', label: 'Viewer Area', roles: ['Admin', 'Editor', 'Viewer'] },
  { to: '/editor', label: 'Editor Tools', roles: ['Admin', 'Editor'] },
  { to: '/admin', label: 'Admin Panel', roles: ['Admin'] },
];

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__mark" aria-hidden="true" />
        <span className="navbar__wordmark">Clearance</span>
      </div>

      <nav className="navbar__links" aria-label="Primary">
        {NAV_LINKS.filter((link) => hasRole(link.roles)).map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar__user">
        {user ? (
          <>
            <div className="navbar__identity">
              <span className="navbar__identity-name">{user.name}</span>
              <RoleBadge role={user.role} showLevel={false} />
            </div>
            <button type="button" className="btn btn--ghost" onClick={handleLogout}>
              Sign out
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
}
