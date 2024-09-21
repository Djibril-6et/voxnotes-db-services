const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/check', userController.checkUserExist);
router.post('/forgot-password', userController.forgotPassword);
router.put('/reset-password', userController.resetPassword);
router.delete('/:id', userController.deleteUser);

module.exports = router;