const {body} = require('express-validator/check');

// Class which contains static functions that
// return validation and sanitization chains for operations with users
// in arrays to use in middlewares
class UserValidator {

    static createNewUser() {
        return [
            body('username')
                .isAlphanumeric().withMessage('Username must be alphanumeric')
                .isLength({min: 4}).withMessage('Too short username')
                .trim(),
            body(['firstName', 'lastName'])
                .not().isEmpty().withMessage('Empty name')
                .trim()
                .escape(),
            body('email')
                .isEmail().withMessage('Invalid email')
                .normalizeEmail(),
            body('password')
                .not().isEmpty().withMessage('Empty password'),
        ];
    }

    static updateUser() {
        return [
            body('username')
                .isAlphanumeric().withMessage('Username must be alphanumeric')
                .isLength({min: 4}).withMessage('Too short username')
                .trim(),
            body(['firstName', 'lastName'])
                .not().isEmpty().withMessage('Empty name')
                .trim()
                .escape(),
            body('email')
                .isEmail().withMessage('Invalid email')
                .normalizeEmail(),
        ];
    }

}

module.exports = UserValidator;