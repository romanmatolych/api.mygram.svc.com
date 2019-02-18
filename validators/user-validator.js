const {body} = require('express-validator/check');

// Class which contains static functions that
// return validation and sanitization chains for operations with users
// in arrays to use in middlewares
class UserValidator {

    static createNewUser() {
        return [
            body('username')
                .isAlphanumeric()
                .isLength({min: 4})
                .trim(),
            body(['firstName', 'lastName'])
                .not().isEmpty()
                .trim()
                .escape(),
            body('email')
                .isEmail()
                .normalizeEmail(),
            body('password')
                .not().isEmpty(),
        ];
    }

    static updateUser() {
        return [
            body('username')
                .isAlphanumeric()
                .isLength({min: 4})
                .trim(),
            body(['firstName', 'lastName'])
                .not().isEmpty()
                .trim()
                .escape(),
            body('email')
                .isEmail()
                .normalizeEmail(),
        ];
    }

}

module.exports = UserValidator;