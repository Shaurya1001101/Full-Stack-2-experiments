const ROLE_META = {
  Admin: { label: 'Admin', level: 'Level 3', className: 'role-badge--admin' },
  Editor: { label: 'Editor', level: 'Level 2', className: 'role-badge--editor' },
  Viewer: { label: 'Viewer', level: 'Level 1', className: 'role-badge--viewer' },
};

export default function RoleBadge({ role, showLevel = true }) {
  const meta = ROLE_META[role] ?? { label: role, level: '', className: '' };
  return (
    <span className={`role-badge ${meta.className}`}>
      <span className="role-badge__dot" aria-hidden="true" />
      {meta.label}
      {showLevel && meta.level ? <span className="role-badge__level">{meta.level}</span> : null}
    </span>
  );
}
