const {body} = require('express-validator/check');

// Class which contains static functions that
// return validation and sanitization chains for authentication info
// in arrays to use in middlewares
class AuthValidator {
    
    static login() {
        return [
            body('username')
                .trim()
                .exists({checkFalsy: true}),
            body('password')
                .exists({checkFalsy: true}),
        ];
    }

}

module.exports = AuthValidator;