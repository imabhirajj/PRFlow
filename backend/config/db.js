const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('[MongoDB Error]: MONGO_URI is not defined in environment variables.');
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('[MongoDB]: Connected successfully');
    } catch (error) {
        console.error('[MongoDB Error] Connection failed:', error.message);
        // Do NOT call process.exit(1) here in production.
        // Calling process.exit(1) terminates the Node process on Render and causes a 502 Bad Gateway!
    }
};

module.exports = connectDB;