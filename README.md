# 🧠 StackIt – Collaborative Q&A Platform

StackIt is a lightweight question-and-answer platform built for students, developers, and learners to ask technical questions, answer peer queries, upvote useful content, and engage in meaningful discussions through comments and real-time notifications.

---

## 👥 Team Members

| Name               | Role               | Email                 |
| ------------------ | ------------------ | --------------------- |
| Bhupendra Dewangan | Backend Developer  | bhupendra@example.com |
| Jaikumar Dewangan  | Frontend Developer | jaikumar@example.com  |
| Bhupesh Dewangan   | UI/UX Designer     | bhupesh@example.com   |

---

## 👨‍🏫 Mentor

- Aman Patel

---

## 🚀 Features

- 🔐 **User Authentication** (JWT)
- ❓ **Ask Questions** with rich text editor and tags
- 💬 **Post Answers** to questions
- 👍 **Upvote** Questions and Answers
- 💬 **Comment** on Answers
- 🔔 **Real-Time Notifications** via Socket.IO
- 🧠 **Get all questions with answers** (for feed display)
- 🧾 **MongoDB-based** backend with Mongoose

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Socket.IO
- JWT Authentication
- Bcrypt

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- PrimeReact (Rich Text Editor)
- React Router

---

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/stackit
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

4. Start the server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

---

## 🎯 Usage

1. **Register/Login**: Create an account or login
2. **Browse Questions**: View all questions on the homepage
3. **Ask Question**: Click "Ask Question" to post your query
4. **Answer**: Provide solutions to questions
5. **Vote**: Upvote helpful questions and answers
6. **Comment**: Engage in discussions

---

## 📁 Project Structure

```
StackIt/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## � API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Questions

- `GET /api/questions/all` - Get all questions
- `POST /api/questions` - Create question (protected)
- `POST /api/questions/:id/upvote` - Upvote question (protected)

### Answers

- `POST /api/answer` - Post answer (protected)
- `POST /api/answer/:id/upvote` - Upvote answer (protected)
- `POST /api/answer/:id/comment` - Comment on answer (protected)

### Notifications

- `GET /api/notifications` - Get user notifications (protected)
- `PUT /api/notifications/:id/read` - Mark as read (protected)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Built for Odoo Hackathon
- Mentor: Aman Patel
- Team: Bhupendra, Jaikumar, Bhupesh

---

**Made with ❤️ by Team StackIt**
