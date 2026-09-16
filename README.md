# Mindful Notes Blog

Mindful Notes Blog is a responsive Next.js blog application powered by the DummyJSON API. It demonstrates a typed Redux Toolkit architecture, Redux-Saga request flows, authenticated blog management, server-rendered post pages, comments, pagination, theme switching, and reusable UI components.

## Setup

### Requirements

- Node.js 20 or newer
- npm

### Install and run locally

1. Clone or download the repository.
2. Open a terminal in the project directory.
3. Install dependencies:

	```bash
	npm install
	```

4. Start the development server:

	```bash
	npm run dev
	```

5. Open [http://localhost:3000](http://localhost:3000).

The project uses the public DummyJSON API, so no local database or environment variables are required. Demo credentials are prefilled on the login screens:

```text
Username: emilys
Password: emilyspass
```

### Production checks

```bash
npm run lint
npm run build
npm run start
```

## Technologies Used

- Next.js 16 App Router
- React 19
- TypeScript
- Redux Toolkit and React Redux
- Redux-Saga for asynchronous API workflows
- Tailwind CSS 4
- Axios for authenticated API requests and interceptors
- next-themes for persistent light/dark mode
- DummyJSON for authentication, posts, and comments data
- ESLint for code quality checks

## Features Implemented

- [x] Typed Redux store with `RootState` and `AppDispatch`
- [x] Redux-Saga middleware with `takeLatest`, `call`, `put`, `select`, and `fork`
- [x] Login and logout flows
- [x] JWT persistence in `localStorage`
- [x] Token expiry checks and automatic logout after unauthorized responses
- [x] Protected dashboard route using an authentication HOC
- [x] Admin dashboard greeting: `Hello Admin`
- [x] Fetch posts through Redux Saga
- [x] Paginated post browsing
- [x] Search posts
- [x] Fetch a single post by ID
- [x] Create, update, and delete posts for authenticated users
- [x] Fetch comments for a post
- [x] Add comments for authenticated users
- [x] Loading, success, empty, retry, and error states
- [x] Redux DevTools integration with development tracing
- [x] Server-rendered post pages with timed revalidation
- [x] Dynamic metadata for post detail pages
- [x] Responsive Tailwind CSS layout
- [x] Persistent light/dark theme toggle
- [x] Reusable buttons, cards, loaders, errors, pagination, toasts, and auth components
- [x] Global error, loading, and not-found route states

## Screenshots and Demo Flow

The following routes are the quickest way to demonstrate the key features in a browser:

| Feature | Route | What to capture |
| --- | --- | --- |
| Public blog feed | `/` | Post grid, login panel, search, and pagination |
| Authentication | `/login` | Prefilled demo login and loading/error state |
| Admin dashboard | `/dashboard` | Protected `Hello Admin` view and user details |
| Server-rendered posts | `/posts` | Revalidated post listing |
| Post details | `/posts/1` | Full post content and comments panel |
| Theme support | Any route | Light and dark theme comparison |

For a local capture, start the server with `npm run dev`, open the routes above, and save images under `docs/screenshots/`. A GIF can show the login redirect, theme toggle, post search, and pagination in one short walkthrough.

Suggested filenames:

```text
docs/screenshots/home.png
docs/screenshots/login-dashboard.gif
docs/screenshots/post-comments.png
docs/screenshots/dark-mode.png
```

## Challenges and Solutions

### Client authentication with server rendering

Authentication is persisted in browser `localStorage`, which is unavailable during server rendering. The app restores the session inside a client-side store initializer and uses hydration-safe rendering for auth-aware navigation and theme controls.

### DummyJSON token differences

DummyJSON responses can expose the JWT as `accessToken` or `token`. The API adapter accepts either form, validates that a token exists, and stores the normalized value for later requests.

### Saga and UI lifecycle coordination

Each asynchronous operation dispatches explicit pending, success, and failure actions. This keeps loading and error state visible in the UI and makes request behavior traceable in Redux DevTools.

### Pagination API shape

The UI works with page numbers, while DummyJSON expects `skip` and `limit`. The posts saga translates the page number into an offset and stores the returned total for the pagination controls.

### Theme consistency

Theme colors are defined as global CSS variables and reused through Tailwind theme utilities. Page-level dark-mode classes ensure that navigation, cards, forms, and the admin dashboard remain readable when the theme changes.

## Future Improvements

- Add a dedicated backend and database for durable post and comment persistence.
- Add role-based authorization instead of treating every authenticated account as an admin.
- Integrate the local cache helper into Redux fetch flows for a complete offline-first experience.
- Add JSON-LD structured data for richer search engine results.
- Add automated unit, saga, component, and end-to-end tests.
- Add optimistic updates with rollback for post mutations and comments.
- Add image uploads, post editing forms, filtering by tags, and infinite scrolling.
- Add CI checks for lint, type safety, build, and tests on every pull request.
