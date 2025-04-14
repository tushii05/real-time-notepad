const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 10 * 60 * 1000,
        sameSite: 'lax',
        httpOnly: true
    },
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URL,
        ttl: 10 * 60,
    }),
});