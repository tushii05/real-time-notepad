const {
    registerUser,
    loginUser,
    logout,
    getUsers,
    getProfile,
    updateUser,
    deleteUser,
    changePasswordService,
    avatarUpload
} = require('../services/useService');

const register = async (req, res) => {
    const { name, username, password } = req.body;
    try {
        await registerUser(name, username, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Registration failed', details: err.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await loginUser(username, password, req);
        req.session.userId = user.id;
        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(400).json({ error: 'Login failed', details: err.message });
    }
};

async function getUsersController(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const result = await getUsers(page, pageSize);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getController(req, res) {
    return getProfile(req, res);
}

async function userLogout(req, res) {
    return logout(req, res);
}

async function updateUserController(req, res) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    const id = req.session.userId;
    const { name } = req.body;
    try {
        const user = await updateUser(id, name);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteUserController(req, res) {
    const { id } = req.params;
    try {
        const user = await deleteUser(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function changePasswordController(req, res) {
    const { oldPassword, newPassword } = req.body;
    const userId = req.session.userId;
    try {
        const result = await changePasswordService(userId, oldPassword, newPassword);
        res.status(200).json({ message: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const uploadAvatar = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await avatarUpload(req.session.userId, req.file);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    register,
    login,
    userLogout,
    getController,
    changePasswordController,
    getUsersController,
    updateUserController,
    deleteUserController,
    uploadAvatar
};