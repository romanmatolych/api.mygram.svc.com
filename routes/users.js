const express = require('express');

const UserController = require('../controllers/user-controller');
const UserValidator = require('../validators/user-validator');

const router = express.Router();

/* GET user page */
router.get('/:id', UserController.getUser);

/* Validate and create new user */
router.post('/', 
    UserValidator.createNewUser(),
    UserController.createNewUser
);

/* Update existing user with validation */
router.put('/:id', 
    UserValidator.updateUser(),
    UserController.updateUser
);

/* Delete existing user */
router.delete('/:id', UserController.deleteUser);

module.exports = router;
