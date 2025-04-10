const express = require('express');
const router = express.Router();

router.get('/csrf-token', (req, res) => {
    res.status(201).json({ success: true, csrfToken: req.session.csrfToken });
});

module.exports = router;