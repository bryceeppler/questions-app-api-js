const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

router.post("/search/username", usersController.searchByUsername);
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUser);
router.post('/login', usersController.loginUser);
router.post('/register', usersController.registerUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;