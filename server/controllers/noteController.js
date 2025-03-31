const { createNote, getNotes, getNoteById, updateNoteById, deleteNoteById } = require('../services/noteService');  // Updated import

async function noteCreate(req, res) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    const userId = req.session.userId;
    const { title, content, theme } = req.body;

    try {
        const note = await createNote(title, content, userId, theme);
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function noteGet(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const contents = await getNotes(page, pageSize);
        res.status(200).json(contents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function noteGetById(req, res) {
    const { id } = req.params;

    try {
        const note = await getNoteById(id);
        if (note) {
            res.status(200).json(note);
        } else {
            res.status(404).json({ error: 'Note not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function noteUpdate(req, res) {
    const { id } = req.params;
    const { title, content, theme } = req.body;

    try {
        const updatedNote = await updateNoteById(id, title, content, theme);
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function noteDelete(req, res) {
    const { id } = req.params;

    try {
        await deleteNoteById(id);
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    noteCreate,
    noteGet,
    noteGetById,
    noteUpdate,
    noteDelete,
};
