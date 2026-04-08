# StackIt - Collaborative Q&A Platform

StackIt is a full-stack Q&A platform where users can ask technical questions, post answers, upvote useful content, comment, and receive live notifications.

## Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Socket.IO
- Frontend: React (Vite), Tailwind CSS, PrimeReact Editor, Axios

## Core Features

- Secure JWT authentication (register, login, current user)
- Rich-text question and answer posting
- Upvotes on questions and answers
- Comments on answers
- Live notification feed with Socket.IO
- Search, sort, and tag-based question filtering
- Fully responsive dark-themed UI

## Project Structure

```text
StackIt/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    server.js
  frontend/
    src/
      components/
      services/
      App.jsx
```

## Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/stackit
JWT_SECRET=replace-with-a-strong-secret
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

## Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

## Production Build

```bash
cd frontend
npm run build
```

## API Highlights

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/questions/all?search=&tag=&sort=`
- `GET /api/questions/:id`
- `POST /api/questions`
- `POST /api/questions/:id/upvote`
- `POST /api/answer`
- `POST /api/answer/:id/upvote`
- `POST /api/answer/:id/comment`
- `GET /api/notifications`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/read-all`

## Notes

- Input HTML is sanitized on the backend.
- Notifications are delivered in real time and persisted in MongoDB.
- The frontend is optimized for mobile and desktop layouts.
