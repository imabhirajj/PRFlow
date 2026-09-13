const express = require('express');
const Progress = require('../models/Progress');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { issueTitle, repository, issueUrl, status } = req.body;

        if (!issueTitle || !repository || !issueUrl) {
            return res.status(400).json({
                message: "Missing required fields (issueTitle, repository, issueUrl)"
            });
        }

        const existingProgress = await Progress.findOne({
            user: req.user.userId,
            issueUrl
        });

        if (existingProgress) {
            return res.status(200).json({
                message: "You are already tracking this issue!",
                progress: existingProgress,
                alreadyTracking: true
            });
        }

        const newProgress = new Progress({
            user: req.user.userId,
            issueTitle,
            repository,
            issueUrl,
            status: status === "Completed" ? "Completed" : "Started"
        });
        await newProgress.save();

        res.status(201).json({
            message: "Contribution started!",
            progress: newProgress,
            alreadyTracking: false
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(200).json({
                message: "You are already tracking this issue!",
                alreadyTracking: true
            });
        }
        console.error('Progress creation error:', err);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const progress = await Progress.find({
            user: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            progress: progress || []
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        if (status && !["Started", "Completed"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Allowed values: 'Started', 'Completed'"
            });
        }

        const targetStatus = status || "Completed";

        const progress = await Progress.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            {
                status: targetStatus
            },
            {
                new: true
            }
        );

        if (!progress) {
            return res.status(404).json({
                message: "Progress not found or unauthorized"
            });
        }

        res.status(200).json({
            message: `Contribution marked as ${targetStatus}!`,
            progress: progress
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const progress = await Progress.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!progress) {
            return res.status(404).json({
                message: "Contribution not found"
            });
        }

        res.json({
            message: "Contribution deleted successfully"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;