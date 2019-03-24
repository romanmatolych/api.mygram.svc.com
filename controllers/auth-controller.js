const {validationResult} = require('express-validator/check');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

/**
 * Class representing a controller with static functions
 * that authenticate a user
 */
class AuthController {

    static login(req, res, next) {
        // Extract validation errors from a request
        const errors = validationResult(req);

        // Information needed to log in
        const userInfo = {
            username: req.body.username,
            password: req.body.password
        };

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), username: userInfo.username, password: userInfo.password});
        }

        // Find a user with this unique username
        User.findOne({username: userInfo.username}, function(err, user) {
            if (err) return next(err);
            if (user === null) return next(createError(404, 'User Not Found'));

            // Compare entered password with the one in the db
            user.checkPassword(userInfo.password, function(err, result) {
                if (err) return next(err);

                // Correct, result === true
                if (result) {
                    const payload = {
                        userId: user._id,
                    };
                    const secret = process.env.JWT_SECRET;
                    const signOptions = {
                        expiresIn: "24h",
                    };
    
                    // Sign header and payload and send him a full token
                    jwt.sign(payload, secret, signOptions, function(err, token) {
                        if (err) return next(err);

                        res.status(200).json({
                            user,
                            token
                        });
                    });
                } else {
                    next(createError(400, "Incorrect login information"));
                }
            });
        });
    }

}

module.exports = AuthController;