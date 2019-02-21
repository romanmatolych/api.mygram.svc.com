const parallel = require('async/parallel');
const createError = require('http-errors');
const {validationResult} = require('express-validator/check');
const debug = require('debug')('api.mygram.svc.com:blog-controller');

const Blog = require('../models/blog');
const Post = require('../models/post');
const User = require('../models/user');

/**
 * Class representing a controller with static functions that process 
 * Blog requests  
 */
class BlogController {

    static getBlog(req, res, next) {
        // Search for a given blog and its posts in the database
        parallel({
            blog: function(callback) {
                Blog.findById(req.params.id, callback);
            },
            blogPosts: function(callback) {
                Post.find({blogId: req.params.id}, callback);
            }
        },
        function (err, results) {
            if (err) return next(err);
            if (results.blog === null) {
                return next(createError(404, 'Blog Not Found'));
            }
    
            debug(`Get blog ${results.blog._id}`);

            res.json({blog: results.blog, blogPosts: results.blogPosts});
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

        if (!errors.isEmpty()) {
            debug('Blog creation validation errors: %j', errors.array());

            return res.status(400).json({errors: errors.array(), blog});
        }

        // Check if such a user exists before creating new blog of him
        User.findById(req.body.userId, function(err, author) {
            if (err) return next(err);
            if (author === null) return next(createError(404, 'User Not Found'));

            Blog.create(blog, function(err, newBlog) {
                if (err) return next(err);
    
                debug('Created new blog %O', newBlog);
    
                res.redirect(201, newBlog.url);
            });
        });
    }

    static updateBlog(req, res, next) {
        // Extract validation errors from a request
        const errors = validationResult(req);
        
        // Update object
        const blog = {
            _id: req.params.id,
            name: req.body.name
        };

        if (!errors.isEmpty()) {
            debug('Blog update validation errors: %j', errors.array());

            return res.status(400).json({errors: errors.array(), blog});
        }
            
        Blog.findByIdAndUpdate(req.params.id, blog, function(err, origBlog) {
            if (err) return next(err);

            debug(`Updated blog ${origBlog._id}`);

            res.redirect(200, origBlog.url);
        });
    }

    // Deletes a blog with all it's posts
    // Sends the deleted blog
    static deleteBlog(req, res, next) {
        Post.deleteMany({blogId: req.params.id}, function(err) {
            if (err) return next(err);
    
            debug(`All posts of blog ${req.params.id} deleted`);

            Blog.findByIdAndRemove(req.params.id, function(err, foundBlog) {
                if (err) return next(err);
                if (foundBlog === null) return next(createError(404, 'Blog Not Found'));
    
                debug(`Deleted blog ${foundBlog._id}`);

                res.json({blog: foundBlog});
            });
        });
    }

}

module.exports = BlogController;