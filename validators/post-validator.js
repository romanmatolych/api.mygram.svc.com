const {body} = require('express-validator/check');
const fetch = require('node-fetch');

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
                .not().isEmpty().withMessage('Empty URL')
                .isURL().withMessage('Invalid URL')
                .custom(value => {
                    return fetch(value, {method: "HEAD"}).then(res => {
                        if (!res.ok || !res.headers.get('Content-Type').startsWith('image/'))
                            return Promise.reject('Invalid content');
                    });
                }),
        ];
    }

}

module.exports = PostValidator;