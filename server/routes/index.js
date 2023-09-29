const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');

const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');
const { refreshToken } = require('../controllers/refreshTokenController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/refresh-token', refreshToken);

// Protect all routes
router.use(verifyJWT);
router.get('/users', getAllUsers);

// 404
router.all('*', (req, res) => {
    res.status(404).json({ message: '404 not found' });
})

module.exports = router;