const {body} = require('express-validator/check');

// Class which contains static functions that
// return validation and sanitization chains for operations with blogs
// in arrays to use in middlewares
class BlogValidator {
    
    static createNewBlog() {
        return [
            body('name')
                .not().isEmpty().withMessage('Empty name')
                .trim()
                .escape(),
        ];
    }

    static updateBlog() {
        return [
            body('name')
                .not().isEmpty().withMessage('Empty name')
                .trim()
                .escape(),
        ];
    }

}

module.exports = BlogValidator;