const createError = require('http-errors');
const {validationResult} = require('express-validator/check');
const debug = require('debug')('api.mygram.svc.com:post-controller');

const Post = require('../models/post');

/**
 * Class representing a controller with static functions that process
 * Post requests
 */
class PostController {

    static getPost(req, res, next) {
        Post.findById(res.locals.postId, function(err, post) {
            if (err) return next(err);
            if (post === null) return next(createError(404, 'Post Not Found'));
    
            debug(`Get post ${post._id}`);

            res.json({post});
        });
    }

    static createNewPost(req, res, next) {
        // Extract validation errors from a request
        const errors = validationResult(req);
        
        // New post object to be created
        const post = {
            blogId: res.locals.blogId,
            desc: req.body.desc,
            imgUrl: req.body.imgUrl
        };

        if (!errors.isEmpty()) {
            debug('Post creation validation errors: %j', errors.array());

            return res.status(400).json({errors: errors.array(), post});
        }

        Post.create(post, function(err, newPost) {
            if (err) return next(err);

            // Calculate index of a new post for its URL
            newPost.getIndex(function(err, i) {
                if (err) return next(err);
                if (i === -1) return next(createError(500));

                debug('Created new post at %d index, %O', i, newPost);

                res.redirect(201, newPost.baseUrl + `/${i + 1}`);
            });
        });
    }

    static updatePost(req, res, next) {
        // Extract validation errors from a request
        const errors = validationResult(req);

        // Update object
        const post = {
            _id: res.locals.postId,
            desc: req.body.desc,
            imgUrl: req.body.imgUrl
        };

        if (!errors.isEmpty()) {
            debug('Post update validation errors: %j', errors.array());

            return res.status(400).json({errors: errors.array(), post});
        }

        Post.findByIdAndUpdate(res.locals.postId, post, function (err, origPost) {
            if (err) return next(err);

            debug(`Updated post ${origPost._id}`);

            res.redirect(200, req.originalUrl);
        });
    }

    // Sends the deleted post
    static deletePost(req, res, next) {
        Post.findByIdAndRemove(res.locals.postId, function(err, foundPost) {
            if (err) return next(err);
            if (foundPost === null) return next(createError(404, 'Post Not Found'));
    
            debug(`Deleted post ${foundPost._id}`);

            res.json({post: foundPost});
        });
    }

}

module.exports = PostController;