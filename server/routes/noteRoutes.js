const express = require('express');
const router = express.Router();
const {
    noteCreate,
    noteGet,
    noteGetById,
    noteUpdate,
    noteDelete
} = require('../controllers/noteController');

router.post('/notes', noteCreate);

router.get('/notes', noteGet);

router.get('/notes/:id', noteGetById);

router.put('/notes/:id', noteUpdate);

router.delete('/notes/:id', noteDelete);

module.exports = router;
