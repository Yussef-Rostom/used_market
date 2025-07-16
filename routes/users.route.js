const express = require('express');
const usersController = require('../controllers/users.controller');
const {verifyToken} = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');
const validator = require('../middlewares/validation');
const {validate} = require('../middlewares/validation');

const router = express.Router();

router.post('/register', validator.register(), validate, usersController.register);
router.post('/login', validator.login(), validate, usersController.login);
router.post('/logout', verifyToken, usersController.logout); 

router.get('/me', verifyToken, usersController.getMyProfile);
router.put('/me', verifyToken, usersController.updateMyProfile);

router.get('/contact/:id', usersController.contactWith);

router.get('/', verifyToken, isAdmin, usersController.getAllUsers);
router.get('/:id', verifyToken, isAdmin, usersController.getUserById);
router.put('/:id', verifyToken, isAdmin, usersController.updateUser);
router.delete('/:id', verifyToken, isAdmin, usersController.deleteUser);

module.exports = router;

