function truncate(value, max = 14) {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

export default function TokenBadge({ decoded }) {
  if (!decoded) return null;
  const { header, payload, encodedHeader, encodedPayload, encodedSignature } = decoded;

  return (
    <div className="token-badge">
      <div className="token-badge__top">
        <div>
          <p className="token-badge__eyebrow">Session credential</p>
          <h3 className="token-badge__name">{payload.name}</h3>
          <p className="token-badge__username">@{payload.username}</p>
        </div>
        <div className="token-badge__chip" aria-hidden="true" />
      </div>

      <div className="token-badge__strip">
        <span className="token-seg token-seg--header" title={JSON.stringify(header)}>
          {truncate(encodedHeader)}
        </span>
        <span className="token-seg token-seg--payload" title="User claims: sub, username, role, iat, exp">
          {truncate(encodedPayload)}
        </span>
        <span className="token-seg token-seg--signature" title="HMAC-SHA256 signature — proves the token wasn't altered">
          {truncate(encodedSignature)}
        </span>
      </div>

      <div className="token-badge__labels">
        <span>Header</span>
        <span>Payload</span>
        <span>Signature</span>
      </div>
    </div>
  );
}
