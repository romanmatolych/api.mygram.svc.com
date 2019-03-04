const {body} = require('express-validator/check');

// Class which contains static functions that
// return validation and sanitization chains for authentication info
// in arrays to use in middlewares
class AuthValidator {
    
    static login() {
        return [
            body('username')
                .trim()
                .exists({checkFalsy: true}).withMessage('No username'),
            body('password')
                .exists({checkFalsy: true}).withMessage('No password'),
        ];
    }

}

module.exports = AuthValidator;