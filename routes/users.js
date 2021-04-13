var express = require('express');
var router = express.Router();
const { uploader } = require('../utils/uploadImage');
const auth = require('../utils/auth');

const userController = require('../controllers/UserController');
const cartController = require('../controllers/CartController');

router.get('/profile', auth.isAuthenticated, userController.getProfile);

router.get('/', userController.getAllUsers);

router.get('/pagination', userController.getUsersPerPage);

router.get('/:id', userController.getUser);

router.post('/', userController.createUser, cartController.createCart);

router.put('/:id', userController.updateUser);

router.put('/:id/password', userController.updateUserPassword);

router.put('/:id/status', userController.updateUserStatus);

router.put(
	'/:id/avatar',
	uploader.single('image'),
	userController.uploadAvatar
);

router.put('/delete/:id', userController.deleteUser);

module.exports = router;
