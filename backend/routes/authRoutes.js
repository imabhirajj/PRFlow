const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();


// SIGNUP
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.json({
                message: 'Already registered!'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered!'
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: 'Error while signup'
        });
    }
});


// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return res.json({
                message: 'You are not registered'
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordValid) {
            return res.json({
                message: 'Invalid password'
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

        res.json({
            message: 'Login Successful',
            token: token
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: 'Error while login'
        });
    }
});


// PROFILE
router.get('/profile', async (req, res) => {
    res.json({
        message: 'Profile route'
    });
});


module.exports = router;