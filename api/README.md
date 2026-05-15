# DevHub API

This is the backend service for DevHub. It provides authentication, profile management, project and blog APIs, likes, comments, follow relationships, search, feed, notifications, and real-time chat.

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- Redis
- JWT authentication with HTTP-only cookies
- Socket.IO
- Zod validation
- Multer
- ImageKit
- Nodemailer

## Folder Overview

```text
api/
  server.js              HTTP and Socket.IO server entry
  src/app.js             Express app, CORS, routes, static frontend serving
  src/routes/            API route definitions
  src/controllers/       Request handlers
  src/services/          Business logic
  src/models/            Mongoose models
  src/validations/       Zod validation schemas
  src/middlewares/       Auth, validation, upload, error handling
  src/socket/            Socket.IO initialization and handlers
  src/utilities/         Cookies, JWT, password, ImageKit helpers
  view/                  Built frontend files served by Express
```

## Available Scripts

```bash
npm run dev
```

Starts the backend with Nodemon on port `8080`.

## Environment Variables

Create an `.env` file in `api/`.

Required variables:

```env
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string

PRIVATE_JWT_KEY_BS64=base64_private_key
PUBLIC_JWT_KEY_BS64=base64_public_key

REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

SENDER_EMAIL=your_email
SENDER_PASSWORD=your_email_app_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLIENT_URL=https://your-frontend-domain.com
SERVER_URL=https://your-backend-domain.com
```

## Authentication

Auth uses signed JWTs stored in HTTP-only cookies:

- `accessToken`: short-lived token
- `refreshToken`: longer-lived token used to renew access

Cookie behavior is protocol-aware:

- HTTPS requests use `SameSite=None` and `Secure`
- HTTP/local requests use `SameSite=Lax` without `Secure`

This helps local development work while still supporting production cookie rules.

## Main API Groups

All routes are mounted under `/api`.

```text
/api/auth          signup, login, google login, getMe, refresh, logout
/api/user          profile updates, public profile, follow/unfollow, followers/following
/api/project       project CRUD and project detail
/api/blog          blog CRUD, draft/publish, blog detail
/api/feed          project/blog feeds
/api/search        user/project/blog search
/api/like          generic like/unlike for projects and blogs
/api/comment       generic comments for projects and blogs
/api/chat          conversations and messages
/api/notification  notifications
```

## Real-Time Features

Socket.IO is initialized in `server.js` and authenticated with the same access token cookie.

Used events include:

- `receive-message`
- `new_notification`
- `delete_notification`

## Static Frontend Serving

`src/app.js` serves the React production build from:

```text
api/view
```

Any non-API route falls back to `view/index.html`, which supports React Router refreshes on nested routes.

## Important Notes

- Do not commit real production secrets.
- If deploying frontend and backend on separate domains, third-party cookie blocking may affect auth. Serving the frontend from the backend domain avoids that issue.
- Restart the backend after changing environment variables.
