const mongoose = require('mongoose');

let lastError = null;

const cleanUri = (uri) => (uri || '').trim().replace(/^["']|["']$/g, '');

const connectDB = async () => {
    const rawUri = process.env.MONGO_URI;
    const mongoUri = cleanUri(rawUri);

    if (!mongoUri) {
        lastError = 'MONGO_URI is not defined in environment variables.';
        console.error('[MongoDB Error]:', lastError);
        return;
    }

    if (mongoose.connection.readyState === 1) {
        return;
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        lastError = null;
        console.log('[MongoDB]: Connected successfully');
    } catch (error) {
        lastError = error.message;
        console.error('[MongoDB Error] Connection failed, retrying in 5s:', error.message);
        setTimeout(connectDB, 5000);
    }
};

const getDbStatus = () => ({
    hasUri: !!cleanUri(process.env.MONGO_URI),
    uriStarts: cleanUri(process.env.MONGO_URI).substring(0, 14),
    state: mongoose.connection.readyState,
    lastError: lastError
});

module.exports = { connectDB, getDbStatus };

