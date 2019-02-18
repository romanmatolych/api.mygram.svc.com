const {body} = require('express-validator/check');

// Class which contains static functions that
// return validation and sanitization chains for operations with posts
// in arrays to use in middlewares
class PostValidator {

    static savePost() {
        return [
            body('desc')
                .optional({checkFalsy: true})
                .trim()
                .escape(),
            body('imgUrl')
                .not().isEmpty()
                .isURL(),
        ];
    }

}

module.exports = PostValidator;