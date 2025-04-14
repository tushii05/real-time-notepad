const express = require('express');
const router = express.Router();
const { prisma } = require('../config/db');
const jwt = require('jsonwebtoken');

router.post('/refresh-token', async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(401).json({ error: 'Refresh token missing' });

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await prisma.user.findUnique({ where: { id: payload.id } });

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m',
        });

        res.json({ accessToken: newAccessToken });

    } catch (err) {
        return res.status(403).json({ error: 'Refresh token expired or invalid' });
    }
});

module.exports = router;