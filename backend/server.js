const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth'); // ⬅️ Import JWT middleware

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/answer', require('./routes/answer'));
app.use('/api/notifications', require('./routes/notifications'));

// ✅ Simple public route
app.get('/', (req, res) => {
  res.send('🚀 StackIt API is running!');
});

// ✅ Test protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: '🎉 You have accessed a protected route!',
    user: req.user, // User info from token
  });
});

// Socket setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('notify', (data) => {
    socket.broadcast.emit('notification', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));