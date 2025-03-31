function isAuthenticated(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    next();
}

module.exports = { isAuthenticated };
