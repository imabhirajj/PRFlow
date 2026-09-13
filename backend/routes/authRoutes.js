const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const router = express.Router();


// SIGNUP
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: 'Name, email, and password are required.'
        });
    }

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

        if (existingUser) {
            return res.status(409).json({
                message: 'An account with this email already exists!'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully!'
        });

    } catch (err) {
        console.error('Signup error:', err);

        res.status(500).json({
            message: 'Error while registering user'
        });
    }
});


// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required.'
        });
    }

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

        if (!existingUser) {
            return res.status(404).json({
                message: 'No account found with this email. Please sign up.'
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid password. Please try again.'
            });
        }

        const token = jwt.sign(
            {
                userId: existingUser._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.status(200).json({
            message: 'Login Successful',
            token: token,
            user: {
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                createdAt: existingUser.createdAt
            }
        });

    } catch (err) {
        console.error('Login error:', err);

        res.status(500).json({
            message: 'Error while login'
        });
    }
});


router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            user
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: 'Server error'
        });
    }
});

const getClientUrl = () => {
    const envClient = process.env.CLIENT_URL;
    const isProd = process.env.NODE_ENV === 'production' || !!process.env.RENDER;

    if (envClient) {
        // Prevent accidental localhost redirect in production
        if (isProd && envClient.includes('localhost')) {
            return 'https://prflow.vercel.app';
        }
        return envClient.replace(/\/+$/, '');
    }

    if (isProd) {
        return 'https://prflow.vercel.app';
    }

    return 'http://localhost:5173';
};

// GITHUB LOGIN
router.get(
    '/github',
    passport.authenticate('github', {
        scope: ['user:email']
    })
);

// GITHUB CALLBACK
router.get(
    '/github/callback',
    (req, res, next) => {
        const clientUrl = getClientUrl();
        passport.authenticate('github', { session: false }, (err, user, info) => {
            if (err) {
                console.error('[GitHub OAuth Callback Error]:', err);
                const errorDetail = err.message || (typeof err === 'string' ? err : 'oauth_failed');
                return res.redirect(`${clientUrl}/login?error=${encodeURIComponent(errorDetail)}`);
            }

            if (!user) {
                console.warn('[GitHub OAuth Callback]: User authentication failed', info);
                const infoDetail = (info && info.message) || 'user_not_found';
                return res.redirect(`${clientUrl}/login?error=${encodeURIComponent(infoDetail)}`);
            }

            const token = jwt.sign(
                {
                    userId: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '7d'
                }
            );

            return res.redirect(
                `${clientUrl}/github-success?token=${token}`
            );
        })(req, res, next);
    }
);

module.exports = router;