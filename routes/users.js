const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

/* GET user page */
router.get('/:id', userController.getUserPage);

/* Create new user */
router.post('/', userController.createNewUser);

/* Update existing user */
router.put('/:id', userController.updateUser);

/* Delete existing user */
router.delete('/:id', userController.deleteUser);

module.exports = router;
