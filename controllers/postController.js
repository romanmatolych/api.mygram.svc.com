const createError = require('http-errors');
const {body, validationResult} = require('express-validator/check');

const Post = require('../models/post');

// GET post
exports.getPostPage = function(req, res, next) {
    Post.findById(res.locals.postId, function(err, post) {
        if (err) return next(err);
        if (post === null) return next(createError(404, 'Post Not Found'));

        res.json({post});
    });
};

// POST (create new post)
exports.createNewPost = [
    // Body validation + sanitization
    
    // blogId is in the params now
    // body('blogId')
    //     .not().isEmpty()
    //     .trim()
    //     .isMongoId(),

    body('desc')
        .optional({checkFalsy: true})
        .trim()
        .escape(),
    body('imgUrl')
        .not().isEmpty()
        .isURL(),

    function(req, res, next) {
        const errors = validationResult(req);
        
        const post = {
            // blogId: req.body.blogId,
            blogId: res.locals.blogId,
            desc: req.body.desc,
            imgUrl: req.body.imgUrl
        };

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), post});
        }

        Post.create(post, function(err, newPost) {
            if (err) return next(err);

            newPost.getIndex(function(err, i) {
                if (err) return next(err);
                if (i === -1) return next(createError(500));

                res.redirect(201, newPost.baseUrl + `/${i}`);
            });
        });
    }
];

exports.updatePost = [
    // Body validation + sanitization
    body('desc')
        .optional({checkFalsy: true})
        .trim()
        .escape(),
    body('imgUrl')
        .not().isEmpty()
        .isURL(),

    function(req, res, next) {
        const errors = validationResult(req);

        const post = {
            _id: res.locals.postId,
            desc: req.body.desc,
            imgUrl: req.body.imgUrl
        };

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), post});
        }

        Post.findByIdAndUpdate(res.locals.postId, post, function (err) {
            if (err) return next(err);

            res.redirect(200, req.originalUrl);
        });
    }
];

exports.deletePost = function(req, res, next) {
    Post.findByIdAndRemove(res.locals.postId, function(err, post) {
        if (err) return next(err);
        if (post === null) return next(createError(404, 'Post Not Found'));

        res.json({post});
    });
}