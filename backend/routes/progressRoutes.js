const express = require('express');
const Progress = require('../models/Progress');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/",authMiddleware, async (req, res) => {
    try{
        const{issueTitle, repository, issueUrl, status } = req.body;

        const newProgress = new Progress({
            user: req.user.userId,
            issueTitle,
            repository,
            issueUrl,
            status
        });
        await newProgress.save();

        res.status(201).json({
            message: "Contribution started!",
            progress: newProgress,
        });

    }

    catch(err){
        console.error(err);

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
            progress
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
        const progress = await Progress.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            {
                status: "Completed"
            },
            {
                new: true
            }
        );

        if (!progress) {
            return res.status(404).json({
                message: "Progress not found"
            });
        }

        res.status(200).json({
            message: "Contribution completed!",
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