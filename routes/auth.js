const express = require('express');

const AuthController = require('../controllers/auth-controller');
const AuthValidator = require('../validators/auth-validator');

const router = express.Router();

router.post('/login', 
    AuthValidator.login(),
    AuthController.login
);

module.exports = router;