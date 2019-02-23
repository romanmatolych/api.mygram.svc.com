const express = require('express');

const UserController = require('../controllers/user-controller');
const UserValidator = require('../validators/user-validator');
const {validateToken, verifyUser} = require('../middlewares/auth-middlewares');

const router = express.Router();

/* Validate and create new user */
router.post('/', 
    UserValidator.createNewUser(),
    UserController.createNewUser
);

// Load user from the db if :userId is present in the path
router.param('userId', UserController.findUser);

/* GET user page */
router.get('/:userId', UserController.getUser);

// Validate user's token and check if that's him before moving on
router.use('/:userId',
    validateToken,
    verifyUser
);

// Use a single route to handle various HTTP methods 
router.route('/:userId')
    /* Update existing user with validation */
    .put(
        UserValidator.updateUser(),
        UserController.updateUser
    )
    /* Delete existing user */
    .delete(UserController.deleteUser);

module.exports = router;
