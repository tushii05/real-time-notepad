const { prisma } = require('../config/db');

async function createNote(title, content, userId, theme = 'default') {
    return await prisma.note.create({
        data: { title, content, userId, theme },
    });
}

async function getNotes(userId, page = 1, pageSize = 10, order = 'desc') {
    const skip = (page - 1) * pageSize;

    const notes = await prisma.note.findMany({
        where: {
            userId: userId
        },
        skip: skip,
        take: pageSize,
        orderBy: {
            createdAt: order
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: false,
                }
            }
        }
    });

    const totalNote = await prisma.note.count({
        where: {
            userId: userId
        }
    });
    return {
        totalNote,
        totalPages: Math.ceil(totalNote / pageSize),
        currentPage: page,
        notes
    };
}

async function getNoteById(noteId) {
    return await prisma.note.findUnique({
        where: { id: noteId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: false,
                }
            }
        }
    });
}

async function updateNoteById(noteId, title, content, theme) {
    return await prisma.note.update({
        where: { id: noteId },
        data: { title, content, theme },
    });
}

async function deleteNoteById(noteId) {
    return await prisma.note.delete({
        where: { id: noteId },
    });
}

module.exports = {
    createNote,
    getNotes,
    getNoteById,
    updateNoteById,
    deleteNoteById,
};