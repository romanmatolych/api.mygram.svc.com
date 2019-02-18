const createError = require('http-errors');
const debug = require('debug')('api.mygram.svc.com:post-middlewares');

const Blog = require('../models/blog');
const Post = require('../models/post');

/**
 * Finds a blog with an id from route parameters
 * If it exists, saves the id in response locals and passes the control further
 */
exports.checkBlog = function(req, res, next) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) return next(err);
        if (blog === null) return next(createError(404, 'Blog Not Found'));

        debug(`Accessing blog ${req.params.id} posts`);

        res.locals.blogId = req.params.id;
        next();
    });
};

/**
 * Sorts all blogs by date in ascending order to 
 * get an id of the blog at the index from request params
 * and passes this id to the next middleware
 */
exports.findPost = function(req, res, next) {
    Post.find({blogId: res.locals.blogId}).sort({createdAt: 1}).exec(function(err, blogPosts) {
        if (err) return next(err);

        const i = parseInt(req.params.index) - 1;
        if (typeof blogPosts[i] === 'undefined') {
            debug(`Cannot find post at index ${req.params.index}`);

            next(createError(404, 'Post Not Found'));
        } else {
            debug(`Found post at index ${i}(${req.params.index})`);

            res.locals.postId = blogPosts[i]._id;
            next();
        } 
    });
};