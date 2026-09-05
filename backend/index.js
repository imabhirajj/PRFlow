const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const ProgressRoutes = require('./routes/progressRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});