# DevHub - Developer Social Platform

DevHub is a mini hackathon sprint project for a full-stack developer social platform. It lets developers create a public portfolio, share projects, publish technical blogs, discover other developers, follow profiles, chat in real time, and receive activity notifications.

## Project Structure

```text
developer/
  api/  Express, MongoDB, Socket.IO backend
  web/  React, Redux Toolkit, Tailwind frontend
```

## Main Features

- Email OTP signup and email/password login
- Google OAuth login
- Protected and public route handling
- Developer dashboard with profile editing
- Profile picture upload through ImageKit
- Skills, experience, education, interests, languages, and social links
- Project CRUD with images, tags, GitHub link, and live link
- Blog CRUD with markdown editor and draft/publish support
- Project and blog detail pages
- Feed with project/blog tabs
- Search across users, projects, and blogs
- Like/unlike for projects and blogs
- Comment modal with optimistic UI updates
- Follow/unfollow with follower and following lists
- Real-time chat using Socket.IO
- Notifications for likes, comments, and follows

## Tech Stack

Frontend:
- React
- React Router
- Redux Toolkit and RTK Query
- Tailwind CSS
- Socket.IO Client
- Sonner toasts

Backend:
- Node.js
- Express
- MongoDB and Mongoose
- Redis
- JWT with HTTP-only cookies
- Socket.IO
- Zod validation
- Multer and ImageKit
- Nodemailer

## Running Locally

Install dependencies in both apps:

```bash
cd api
npm install

cd ../web
npm install
```

Start the backend:

```bash
cd api
npm run dev
```

Start the frontend during development:

```bash
cd web
npm run dev
```

## Single-Origin Deployment

The backend can serve the built frontend from `api/view`.

Build and copy frontend:

```bash
cd web
npm run build
```

Copy `web/dist` contents into `api/view`. The current backend is already configured to serve this folder and fallback to `index.html` for SPA routes.

This single-origin setup avoids third-party cookie issues because API, frontend, and Socket.IO run on the same backend domain.

## Notes

- Keep real `.env` secrets private.
- For production, set `NODE_ENV=production`.
- For cross-origin deployment, configure `CLIENT_URL`, `VITE_API_URL`, and `VITE_SOCKET_URL`.
- For same-origin deployment, the frontend can use `/api` and `window.location.origin`.
