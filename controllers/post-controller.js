const createError = require('http-errors');
const {validationResult} = require('express-validator/check');
const debug = require('debug')('api.mygram.svc.com:post-controller');
const {Types: {ObjectId}} = require('mongoose');

const Post = require('../models/post');

/**
 * Class representing a controller with static functions that process
 * Post requests
 */
class PostController {

    /**
     * Sorts all blogs by date in ascending order to 
     * get an id of the blog at the index from the param
     * and passes it to the next middleware
     */
    static findPost(req, res, next, postInd) {
        Post.find({blogId: req.params.blogId}).sort({createdAt: 1}).exec(function(err, blogPosts) {
            if (err) return next(err);
    
            const i = parseInt(postInd) - 1;
            if (!Number.isInteger(i) || i < 0) return next(createError(400));
            if (typeof blogPosts[i] === 'undefined') {
                debug(`Cannot find post at index ${postInd}`);
                next(createError(404, 'Post Not Found'));
            } else {
                debug(`Found post at index ${i}(${postInd})`);
                res.locals.post = blogPosts[i];
                next();
            } 
        });
    }

    static getPost(req, res, next) {
        const post = res.locals.post;
        res.json({post});
    }

    static createNewPost(req, res, next) {
        // Extract validation errors from a request
        const errors = validationResult(req);
        
        // New post object to be created
        const post = {
            blogId: req.params.blogId,
            desc: req.body.desc,
            imgUrl: req.body.imgUrl
        };

        const payload = res.locals.payload,
            blog = res.locals.blog;
        if (payload && payload.userId == blog.userId) {
            // Validate blogId
            if (!ObjectId.isValid(post.blogId)) return next(createError(400));
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
                    newPost = newPost.toObject();
                    newPost.url = `${newPost.baseUrl}/${i + 1}`;
                    res.status(201).json({post: newPost});
                });
            });
        } else {
            next(createError(403));
        }
    }

    static updatePost(req, res, next) {
        // Extract validation errors from a request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            debug('Post update validation errors: %j', errors.array());
            return res.status(400).json({errors: errors.array(), post: req.body});
        }

        // Update object
        const post = res.locals.post; 
        post.desc = req.body.desc;
        post.imgUrl = req.body.imgUrl;
        post.save(function(err, savedPost) {
            if (err) return next(err);

            debug(`Updated post ${savedPost._id}`);
            res.redirect(200, req.originalUrl);
        });
    }

    // Sends the deleted post
    static deletePost(req, res, next) {
        const post = res.locals.post;
        post.remove(function(err, removedPost) {
            if (err) return next(err);
    
            debug(`Deleted post ${removedPost._id}`);
            res.json({post: removedPost});
        });
    }

}

module.exports = PostController;