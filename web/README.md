# DevHub Web

This is the React frontend for DevHub, a developer social platform where users can manage their portfolio, share projects, write blogs, follow other developers, chat, and receive notifications.

## Tech Stack

- React
- Vite
- React Router
- Redux Toolkit
- RTK Query
- Tailwind CSS
- Socket.IO Client
- Lucide React
- Sonner
- UIW React Markdown Editor

## Folder Overview

```text
web/
  src/app/              app routes, layouts, store, auth initializer
  src/features/         feature-based modules
  src/shared/           shared API, UI, hooks, utilities, socket service
  src/index.css         global styles and Tailwind setup
```

## Feature Modules

```text
features/auth          signin, signup, OTP modal, auth API, auth slice
features/landing       landing page
features/dashboard     profile editing, project/blog management
features/profile       public profile, follow/unfollow, follower lists
features/project       project detail page and project API
features/blog          blog detail page and blog API
features/feed          project/blog feed
features/search        search users/projects/blogs
features/like          reusable like API and debounced like hook
features/comment       comment modal and comment API
features/message       chat page and chat API
features/notification  notifications page and notification API
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Local Development

Start the backend first:

```bash
cd ../api
npm run dev
```

Start the frontend:

```bash
cd ../web
npm run dev
```

## Environment Variables

Create a `.env` file in `web/`.

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8080
```

For single-origin backend deployment, `VITE_API_URL` and `VITE_SOCKET_URL` can be omitted because the app falls back to:

```text
API: /api
Socket: window.location.origin
```

## Authentication Flow

Signup:

1. User enters name, email, and password.
2. Frontend sends only email to request OTP.
3. User enters OTP.
4. Frontend sends email, OTP, name, and password to create the account.
5. Backend sets HTTP-only auth cookies.

Login:

1. User logs in with email/password or Google.
2. Backend sets HTTP-only auth cookies.
3. `AuthInitializer` checks the session with `getMe`.
4. Protected pages become available when user data exists in Redux state.

## Real-Time Flow

The shared socket service creates one Socket.IO client instance. `ProtectedLayout` connects it after login, and `MessageObserver` keeps chat and notification caches fresh.

## Production Build

Build the frontend:

```bash
npm run build
```

For single-origin deployment, copy the contents of `web/dist` into:

```text
api/view
```

The backend serves these files directly.

## Notes

- RTK Query is used for server state and cache updates.
- Like, follow, and message interactions use debounced or optimistic UI patterns where useful.
- The UI uses CSS variables and Tailwind utility classes for a dark developer-focused theme.
