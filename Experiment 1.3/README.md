# Clearance — JWT Authentication & RBAC Lab

A single React app that implements **Experiment 1** (JWT-based authentication)
and **Experiment 2** (role-based access control) together, as one connected
system: signing in produces a signed token, and that token's `role` claim is
what the router checks on every subsequent page.

There is no backend server. A mock auth service and a mock API client stand
in for one, so the full token lifecycle — create, store, attach, verify,
expire — can be observed entirely in the browser, per both experiments'
"mock-based" software requirements.

---

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

> **First run:** this project adds `react-router-dom`, which your existing
> `node_modules` won't have yet — `npm install` picks it up.

### Demo accounts

| Username | Password   | Role   |
|----------|-----------|--------|
| `admin`  | admin123  | Admin  |
| `editor` | editor123 | Editor |
| `viewer` | viewer123 | Viewer |

The login screen also has one-click buttons for each of these.

---

## Experiment 1 — JWT Authentication

**Aim:** design and implement a secure authentication system using JWT for
user login and session management.

**Conceptual flow → where it lives:**

| Step | Implementation |
|---|---|
| User logs in with credentials | `src/pages/Login.jsx` |
| Server validates user | `src/auth/authService.js` → `authenticate()` |
| JWT token is generated | `src/auth/jwt.js` → `createToken()` (HS256, real HMAC-SHA256 via the browser's Web Crypto API) |
| Token is stored on client | `src/auth/AuthContext.jsx` → `localStorage`, key `clearance.token` |
| Token is sent with each request | `src/auth/apiClient.js` → `request()`, invoked from `Dashboard.jsx` |

A JWT's three parts are rendered visually on the Dashboard as a keycard
("Your token" card):

- **Header** — `{ alg: "HS256", typ: "JWT" }`
- **Payload** — the claims: `sub`, `username`, `name`, `role`, `iat`, `exp`
- **Signature** — HMAC-SHA256 over the header and payload, proving the token
  wasn't tampered with

Sessions are stateless: nothing about "who's logged in" is stored on a
server. Every check re-verifies the token that's already sitting in
`localStorage` — that's what `AuthContext` does on page load, and what
`apiClient.request()` does before returning mock data. Tokens expire 15
minutes after issue (`TOKEN_TTL_SECONDS` in `authService.js`); the Dashboard
shows a live countdown, and expiry triggers an automatic sign-out with a
"session expired" notice on the login screen.

---

## Experiment 2 — Role-Based Access Control

**Aim:** implement role-based access control and secure application routes
based on user permissions.

**Roles:** `Admin`, `Editor`, `Viewer` — carried as the `role` claim inside
the JWT issued in Experiment 1, so authorization is built directly on top of
authentication rather than as a separate system.

**Implementation → where it lives:**

| Requirement | Implementation |
|---|---|
| Define user roles | `src/auth/authService.js` → `MOCK_USERS` |
| Store role in auth state | `role` claim inside the JWT payload, read via `AuthContext` |
| Protect routes with React Router | `src/components/ProtectedRoute.jsx` (must be signed in) and `src/components/RoleBasedRoute.jsx` (must hold an allowed role), composed in `src/App.jsx` |
| Restrict access by role | `/admin` → Admin only · `/editor` → Editor or Admin · `/viewer` and `/dashboard` → any signed-in role |
| Conditionally render UI | `src/components/Navbar.jsx` filters nav links by role before rendering them |
| Redirect unauthorized users | `RoleBasedRoute` redirects to `/unauthorized`, which explains what clearance was required |

---

## Project structure

```
src/
  auth/
    jwt.js            create/decode/verify a JWT (HS256, Web Crypto)
    authService.js     mock user directory + login
    apiClient.js        simulated protected API call
    AuthContext.jsx      session state, login/logout, expiry timer
  components/
    ProtectedRoute.jsx    auth guard
    RoleBasedRoute.jsx    role guard
    Layout.jsx            navbar + page outlet
    Navbar.jsx             role-aware navigation
    RoleBadge.jsx           clearance-tier pill
    TokenBadge.jsx           decoded-JWT keycard visual
  pages/
    Login.jsx, Dashboard.jsx, ViewerPage.jsx, EditorPage.jsx,
    AdminPanel.jsx, Unauthorized.jsx, NotFound.jsx
  App.jsx    route table
  main.jsx    entry point
  index.css   design system
```

## Security notes (read before reusing this anywhere real)

This lab intentionally simplifies things that a production system must not:

- **The signing secret lives in frontend code** (`TOKEN_SECRET` in
  `authService.js`). In a real system, only the server ever sees the secret —
  if the browser can sign tokens, so can an attacker.
- **Tokens sit in `localStorage`**, which is readable by any script on the
  page (an XSS risk). Production systems typically use an `httpOnly`,
  `Secure` cookie instead, so client-side JavaScript can't read the token at
  all.
- **Passwords are plaintext in a JS array.** A real backend hashes passwords
  (e.g. bcrypt/argon2) and never compares them directly.
- **No refresh tokens.** Real systems pair a short-lived access token with a
  longer-lived refresh token so users aren't fully logged out every 15
  minutes.

None of this blocks the lab's learning goals — the token structure, signing,
verification, storage, and role-based routing all behave exactly as they
would with a real server behind them.
