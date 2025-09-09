const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Authentication API is running!' });
});

app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Self-ping to prevent sleep mode
  if (process.env.NODE_ENV === 'production') {
    const serverUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    setInterval(() => {
      fetch(serverUrl)
        .then(() => console.log('Self-ping successful'))
        .catch(() => console.log('Self-ping failed'));
    }, 10000); // 10 seconds
  }
});