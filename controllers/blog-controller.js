const createError = require('http-errors');
const {validationResult} = require('express-validator/check');
const debug = require('debug')('api.mygram.svc.com:blog-controller');
const {Types: {ObjectId}} = require('mongoose');

const Blog = require('../models/blog');
const Post = require('../models/post');
const User = require('../models/user');

/**
 * Class representing a controller with static functions that process 
 * Blog requests  
 */
class BlogController {

    static findBlog(req, res, next, blogId) {
        // Validate blogId
        if (!ObjectId.isValid(blogId)) return next(createError(400));
        // Look for a given blog
        Blog.findById(blogId, function(err, blog) {
            if (err) return next(err);
            if (blog === null) return next(createError(404, 'Blog Not Found'));

            res.locals.blog = blog;
            next();
        });
    }

    static getBlog(req, res, next) {
        // Add blog's posts and the info
        const blog = res.locals.blog;
        Post.find({blogId: blog._id}, function(err, posts) {
            if (err) return next(err);

            res.json({blog, posts});
        });
    }

    static createNewBlog(req, res, next) {
        // Extract validation errors from a request
        const errors = validationResult(req);
        
        // Object of a new blog with entered information
        const blog = {
            userId: req.body.userId,
            name: req.body.name
        };

        // Check if such a user exists before creating new blog of him
        User.findById(req.body.userId, function(err, author) {
            if (err) return next(err);
            if (author === null) return next(createError(404, 'User Not Found'));

            const payload = res.locals.payload;
            if (payload && payload.userId === blog.userId) {
                if (!errors.isEmpty()) {
                    debug('Blog creation validation errors: %j', errors.array());
                    return res.status(400).json({errors: errors.array(), blog});
                }
    
                Blog.create(blog, function(err, newBlog) {
                    if (err) return next(err);
        
                    debug('Created new blog %O', newBlog);
                    res.redirect(201, newBlog.url);
                });
            } else {
                next(createError(403));
            }
        });
    }

    static updateBlog(req, res, next) {
        // Extract validation errors from a request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            debug('Blog update validation errors: %j', errors.array());
            return res.status(400).json({errors: errors.array(), blog: req.body});
        }

        // Update object
        const blog = res.locals.blog;
        blog.name = req.body.name;
            
        blog.save(function(err, savedBlog) {
            if (err) return next(err);

            debug(`Updated blog ${savedBlog._id}`);
            res.redirect(200, savedBlog.url);
        });
    }

    // Deletes a blog with all it's posts
    // Sends the deleted blog
    static deleteBlog(req, res, next) {
        const blog = res.locals.blog;
        Post.deleteMany({blogId: blog._id}, function(err) {
            if (err) return next(err);
    
            debug(`All posts of blog ${blog._id} deleted`);
            // Remove the blog itself
            blog.remove(function(err, removedBlog) {
                if (err) return next(err);
                
                debug(`Deleted blog ${removedBlog._id}`);
                res.json({blog: removedBlog});
            });
        });
    }

}

module.exports = BlogController;