const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
// const morgan = require('morgan');
// const winston = require('winston');
// require('winston-daily-rotate-file');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const csrfMiddleware = require('./middlewares/csrfMiddleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

connectDB();

const allowedOrigins = ['http://localhost:5173'];
app.use(
    cors({
        origin: function (origin, callback) {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

app.use(helmet({
    crossOriginResourcePolicy: false,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    keyGenerator: (req, res) => req.ip,
});
app.use(limiter);

app.use(express.json());
app.use(cookieParser());

// const logRotateTransport = new winston.transports.DailyRotateFile({
//     filename: 'logs/app-%DATE%.log',
//     datePattern: 'YYYY-MM-DD',
//     zippedArchive: false,
//     maxSize: '10m',
//     maxFiles: '15d',
// });

// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.printf(({ timestamp, level, message }) => {
//             return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
//         })
//     ),
//     transports: [
//         logRotateTransport,
//         // new winston.transports.Console(),  // Log to console as well

//     ],
// });

// app.use(
//     morgan('combined', {
//         stream: {
//             write: (message) => logger.info(message.trim()),
//         },
//     })
// );

app.use(
    session({
        secret: process.env.SESSION_SECRET,
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
    })
);

app.use(csrfMiddleware);


app.use('/api', userRoutes);
app.use('/api', noteRoutes);

app.use('/api/csrf-token', (req, res) => {
    res.status(201).json({ success: true, csrfToken: req.session.csrfToken })
});

app.use((err, req, res, next) => {
    console.error('Global Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});