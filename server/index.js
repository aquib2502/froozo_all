const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
  }
});

// Store io instance on app to access in routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Froozo POS Server running', timestamp: new Date() });
});

// Socket connection
io.on('connection', (socket) => {
  console.log('⚡ Client connected to socket:', socket.id);
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected from socket:', socket.id);
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/froozo_pos')
  .then(async () => {
    console.log('✅ MongoDB connected');
    // Auto seed if empty
    const Category = require('./models/Category');
    const count = await Category.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial data...');
      require('./seed/seedData');
    }
  })
  .catch((err) => console.error('MongoDB error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Froozo POS Server running on port ${PORT}`);
});

