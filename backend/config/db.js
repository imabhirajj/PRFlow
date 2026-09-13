const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('[MongoDB Error]: MONGO_URI is not defined in environment variables.');
        return;
    }

    if (mongoose.connection.readyState === 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('[MongoDB]: Connected successfully');
    } catch (error) {
        console.error('[MongoDB Error] Connection failed, retrying in 5s:', error.message);
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;
