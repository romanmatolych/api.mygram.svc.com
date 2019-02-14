const createError = require('http-errors');
const {body, validationResult} = require('express-validator/check');

const Post = require('../models/post');

// GET post
exports.getPostPage = function(req, res, next) {
    Post.find({blogId: res.locals.blogId}).sort({createdAt: 1}).exec(function(err, blogPosts) {
        if (err) return next(err);

        const i = parseInt(req.params.index);
        if (typeof blogPosts[i] === 'undefined') {
            return next(createError(404, 'Post Not Found'));
        } else {
            res.json({post: blogPosts[i]});
        } 
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

            newPost.getIndex(res.locals.blogId, function(err, i) {
                if (err) return next(err);

                res.redirect(201, req.originalUrl + `/${i}`);
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
            _id: req.params.id,
            desc: req.body.desc,
            imgUrl: req.body.imgUrl
        };

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), post});
        }

        Post.findByIdAndUpdate(req.params.id, post, function (err) {
            if (err) return next(err);

            res.redirect(200, req.originalUrl);
        });
    }
];

exports.deletePost = function(req, res, next) {
    Post.find({blogId: res.locals.blogId}).sort({createdAt: 1}).exec(function(err, blogPosts) {
        if (err) return next(err);

        const i = parseInt(req.params.index);
        if (typeof blogPosts[i] === 'undefined') {
            return next(createError(404, 'Post Not Found'));
        } else {
            blogPosts[i].remove(function(err, post) {
                if (err) return next(err);

                res.json({post});
            })
        } 
    });
}