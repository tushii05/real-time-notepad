const express = require('express');
const { isAuthenticated, authenticateToken } = require('../middlewares/authMiddleware')
const router = express.Router();
const upload = require('../middlewares/upload');
const {
    register,
    login,
    userLogout,
    getUsersController,
    getController,
    updateUserController,
    deleteUserController,
    changePasswordController,
    uploadAvatar
} = require('../controllers/userController');

router.get('/userDetails', isAuthenticated, getController);
router.get('/users', getUsersController);

router.post('/register', register);
router.post('/logout', isAuthenticated, userLogout);
router.post('/login', login);
router.put('/users', isAuthenticated, updateUserController);
router.delete('/users/:id', isAuthenticated, deleteUserController);
router.put('/change-password', isAuthenticated, changePasswordController);
router.put('/avatar', upload.single('avatar'), uploadAvatar);


module.exports = router;