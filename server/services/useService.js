const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { prisma } = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/passcheck');

async function registerUser(name, username, password) {

    const existingUser = await prisma.user.findUnique({
        where: { username }
    })

    if (existingUser) {
        throw new Error("Username already taken");
    }

    const hashedPassword = await hashPassword(password);
    return await prisma.user.create({
        data: {
            name,
            username,
            password: hashedPassword,
        },
    });
}

async function loginUser(username, password, req) {
    const MAX_ATTEMPTS = 3;

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.blockedUntil && new Date() < new Date(user.blockedUntil)) {
        throw new Error(`Your account is temporarily blocked. Try again after some time`);
    }
    if (user.sessionId && user.sessionId !== req.sessionID) {
        const sessionExists = await new Promise((resolve) => {
            req.sessionStore.get(user.sessionId, (err, session) => {
                if (err || !session) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
        if (!sessionExists) {
            await prisma.user.update({
                where: { username },
                data: { sessionId: null },
            });
        } else {
            throw new Error('You are already logged in from another device.');
        }
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        const newFailedCount = user.failedCount + 1;
        const remainingAttempts = MAX_ATTEMPTS - newFailedCount;

        await prisma.user.update({
            where: { username },
            data: {
                failedCount: newFailedCount,
                lastAttempt: new Date(),
                blockedUntil: newFailedCount >= MAX_ATTEMPTS ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
            },
        });

        if (newFailedCount >= MAX_ATTEMPTS) {
            throw new Error(`Too many failed attempts. Your account is blocked for 24 hours.`);
        }

        throw new Error(`Invalid credentials. Attempts used: ${newFailedCount}/${MAX_ATTEMPTS}. Remaining: ${remainingAttempts}`);
    }

    const sessionID = req.sessionID;

    await prisma.user.update({
        where: { username },
        data: {
            failedCount: 0,
            blockedUntil: null,
            sessionId: req.sessionID,

        },
    });

    return user;
}

async function getProfile(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
            select: {
                id: true,
                name: true,
                username: true,
                avatar: true
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const sessionExpiresAt = req.session.cookie._expires;

        return res.json({
            ...user,
            sessionExpiresAt: new Date(sessionExpiresAt).getTime()
        });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
    }
}

async function logout(req, res) {
    const userId = req.session.userId;

    if (userId) {
        await prisma.user.update({
            where: { id: userId },
            data: { sessionId: null },
        });
    }
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
};

async function getUsers(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;
    const users = await prisma.user.findMany({
        skip: skip,
        take: pageSize,
    });

    const totalUsers = await prisma.user.count();

    return {
        totalUsers,
        totalPages: Math.ceil(totalUsers / pageSize),
        currentPage: page,
        users
    };
}

async function updateUser(id, name) {
    return await prisma.user.update({
        where: { id },
        data: { name },
    });
}

async function deleteUser(id) {
    return await prisma.user.delete({
        where: { id },
    });
}

async function changePasswordService(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error('User not found');
    }

    const isOldPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isOldPasswordValid) {
        throw new Error('Old password is incorrect');
    }

    const isNewPasswordInHistory = await Promise.all(
        user.lastPasswords.map(async (hashedPassword) => {
            return await comparePassword(newPassword, hashedPassword);
        })
    );

    if (isNewPasswordInHistory.includes(true)) {
        throw new Error('New password cannot be the same as any of the last 5 passwords');
    }

    const hashedNewPassword = await hashPassword(newPassword);

    const updatedLastPasswords = [...user.lastPasswords, user.password].slice(-5);

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            password: hashedNewPassword,
            lastPasswords: updatedLastPasswords,
        },
    });

    return updatedUser;
}

const deleteOldAvatar = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.avatar) {
        const filePath = path.join(__dirname, '../uploads', user.avatar);
        try {
            await promisify(fs.unlink)(filePath);
        } catch (err) {
            console.error('Error deleting old avatar:', err);
        }
    }
};

async function avatarUpload(userId, file) {
    if (!file) {
        throw new Error('No file uploaded');
    }

    await deleteOldAvatar(userId);

    const fileExt = path.extname(file.originalname);
    const fileName = `${userId}-${Date.now()}${fileExt}`;
    const filePath = path.join(__dirname, '../uploads', fileName);

    await promisify(fs.rename)(file.path, filePath);

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { avatar: fileName },
        select: {
            id: true,
            name: true,
            username: true,
            avatar: true
        }
    });

    return updatedUser;
}

module.exports = {
    registerUser,
    getProfile,
    loginUser,
    logout,
    getUsers,
    updateUser,
    changePasswordService,
    deleteUser,
    avatarUpload
};