# Recipe Manager Frontend

React single-page application (SPA) for browsing, creating, and managing recipes. Secured with Keycloak OIDC
authentication and consumes the Recipe Manager REST API.

## Features

- OIDC/OAuth2 login/logout via Keycloak
- Authenticated recipe browsing, search (by ingredient/name), create, update, delete
- Responsive Material UI design
- Type-safe API integration with React Query
- JWT token lifecycle management and refresh

## Tech Stack

- **Framework:** React 19, TypeScript
- **Build tool:** Vite
- **UI Library:** Material UI 7
- **State management & server sync:** React Query (TanStack Query)
- **Routing:** React Router 7
- **Authentication:** Keycloak 24 (via react-keycloak)
- **Testing:** Vitest + React Testing Library
- **Code quality:** ESLint 9, Prettier

## Prerequisites

- Node.js 20+
- npm
- Running Keycloak instance (see [parent README](../README.md#run-locally) for local setup)
- Running backend API (see [`recipe-manager-backend/README.md`](../recipe-manager-backend/README.md))

## Quick Start (Local Development)

1. Ensure infrastructure is running (PostgreSQL, Keycloak, backend):

   ```bash
   cd recipe-manager-backend
   make stack-up
   make start
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:5173`.

4. Open `http://localhost:5173` in your browser. You'll be redirected to Keycloak login.
    - Default credentials: `testuser` / `test123`

## Environment Variables

Create a `.env` file in this directory (or use the existing defaults):

```env
VITE_API_URL=http://localhost:8080
VITE_IAM_URL=http://localhost:8081
VITE_IAM_REALM=recipe-manager
VITE_IAM_CLIENT_ID=recipe-manager-frontend
```

| Variable             | Default                   | Purpose                |
|----------------------|---------------------------|------------------------|
| `VITE_API_URL`       | `http://localhost:8080`   | Backend API base URL   |
| `VITE_IAM_URL`       | `http://localhost:8081`   | Keycloak server URL    |
| `VITE_IAM_REALM`     | `recipe-manager`          | Keycloak realm name    |
| `VITE_IAM_CLIENT_ID` | `recipe-manager-frontend` | Keycloak client/app ID |

## Scripts

| Command           | Purpose                             |
|-------------------|-------------------------------------|
| `npm run dev`     | Start dev server                    |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview production build locally    |
| `npm run lint`    | Check code with ESLint              |
| `npm run format`  | Format code with Prettier           |
| `npm test`        | Run Vitest unit tests               |

## Project Layout

```text
src/
  ├── App.tsx              # Main app component + routing
  ├── main.tsx             # React DOM render entry
  ├── api/                 # Backend API client integration
  ├── components/          # Reusable React components
  ├── hooks/               # Custom React hooks
  ├── pages/               # Full-page route components
  └── types/               # TypeScript interfaces/types
public/                    # Static assets
index.html                 # Entry HTML template
vite.config.ts            # Vite build config
tsconfig.json             # TypeScript compiler config
eslint.config.js          # ESLint rules
.prettierrc                # Prettier format config
```

## API Integration

The frontend makes requests to the backend's `/api/recipes` endpoints, always including a Bearer token from Keycloak:

```typescript
Authorization: Bearer <access_token>
```

Responses are cached and synchronized via React Query for seamless UX. See `src/api/` for client implementation.

## Testing

Run unit tests with:

```bash
npm test
```

Tests use React Testing Library for component testing and can be extended with integration/E2E testing frameworks (e.g.,
Cypress, Playwright) as noted in the parent README.
