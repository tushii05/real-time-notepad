const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');
const sessionMiddleware = require('./config/sessionConfig');
const helmetConfig = require('./config/helmetConfig');
const corsConfig = require('./config/corsConfig');
const rateLimiter = require('./config/rateLimiter');
const errorMiddleware = require('./middlewares/errorMiddleware');
// const loggerMiddleware = require('./middlewares/loggerMiddleware');
const csrfMiddleware = require('./middlewares/csrfMiddleware');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const csrfRoutes = require('./routes/csrfRoutes');
const refreshTokenRoutes = require('./routes/refreshTokenRoutes')

const app = express();

connectDB();

app.use(corsConfig);
app.use(helmetConfig);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(rateLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);
// app.use(loggerMiddleware);
app.use(csrfMiddleware);


app.use('/hello', (req, res) => {
    return res.json({ message: "Hello" })
})

app.use('/api/users', userRoutes);
app.use('/api', noteRoutes);
app.use('/api', csrfRoutes);
app.use('/api', refreshTokenRoutes);
app.use(errorMiddleware);

module.exports = app;