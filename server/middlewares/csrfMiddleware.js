const crypto = require('crypto');

const generateCSRFToken = () => {
    return crypto.randomBytes(24).toString('hex');
};

const csrfMiddleware = (req, res, next) => {
    const session = req.session;

    if (!session.csrfToken) {
        session.csrfToken = generateCSRFToken();
    }

    const tokenFromClient = req.get('x-csrf-token') || req.body._csrf || req.query._csrf;

    const isUnsafeMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase());

    if (isUnsafeMethod) {
        if (!tokenFromClient || tokenFromClient !== session.csrfToken) {
            return res.status(403).json({ success: false, message: 'Invalid or missing CSRF token' });
        }
    }

    res.locals.csrfToken = session.csrfToken;
    next();
};

module.exports = csrfMiddleware;
