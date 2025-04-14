const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    next();
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token missing' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}

module.exports = { isAuthenticated, authenticateToken };
