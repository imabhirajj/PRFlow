require('dotenv').config();
const express = require('express');
const cors = require("cors");
const connectDB = require('./config/db');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const ProgressRoutes = require('./routes/progressRoutes');
const passport = require('./config/passport');


const app = express();

// Enable reverse proxy trust (critical for Render HTTPS termination & OAuth callbacks)
app.set('trust proxy', 1);

// Allowed origins for CORS (Vercel production, preview deployments, local dev)
const allowedOrigins = [
  'https://prflow.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.startsWith('http://localhost:')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(passport.initialize());
app.use('/api/auth', authRoutes);
app.use('/api/progress', ProgressRoutes);

connectDB();

app.get('/', (req, res) => {
    res.send('PRFlow Backend is running!');
});

app.post('/test-user', async (req, res) => {
    try {
        const user = await User.create({
            name: 'Abhi',
            email: 'abhi@test.com',
            password: '123456'
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/protected",authMiddleware,(req,res) => {
    res.json({
        message: "You have access to protected route"
    });
})

const mongoose = require('mongoose');

app.get('/health', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.status(200).json({
        status: 'ok',
        dbConnected: isDbConnected,
        dbState: mongoose.connection.readyState,
        timestamp: new Date().toISOString()
    });
});

process.on('uncaughtException', (err) => {
    console.error('[FATAL] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (0.0.0.0)`);
});