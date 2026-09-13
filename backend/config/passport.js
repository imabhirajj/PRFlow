const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

const getCallbackURL = () => {
    const envCallback = process.env.GITHUB_CALLBACK_URL;
    const isProd = process.env.NODE_ENV === 'production' || !!process.env.RENDER;

    if (envCallback) {
        // Prevent accidental localhost URL in production environment
        if (isProd && envCallback.includes('localhost')) {
            return 'https://prflow-backend.onrender.com/api/auth/github/callback';
        }
        return envCallback;
    }

    // Default production callback URL on Render
    if (isProd) {
        return 'https://prflow-backend.onrender.com/api/auth/github/callback';
    }

    // Default local development callback URL
    return 'http://localhost:5000/api/auth/github/callback';
};

const callbackURL = getCallbackURL();

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.warn('[GitHub OAuth] Warning: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not configured in environment variables.');
}

console.log(`[GitHub OAuth] Configured Callback URL: ${callbackURL}`);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID || 'missing_client_id',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || 'missing_client_secret',
            callbackURL: callbackURL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email =
                    profile.emails?.[0]?.value ||
                    `${profile.username || profile.id}@github.com`;

                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        name: profile.displayName || profile.username || 'GitHub User',
                        email,
                        password: `github_${profile.id}`
                    });
                }

                done(null, user);
            } catch (error) {
                console.error('[GitHub OAuth Strategy Error]:', error);
                done(error, null);
            }
        }
    )
);

module.exports = passport;