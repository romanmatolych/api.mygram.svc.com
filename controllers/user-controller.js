const async = require('async');
const createError = require('http-errors');
const {validationResult} = require('express-validator/check');
const debug = require('debug')('api.mygram.svc.com:user-controller');

const User = require('../models/user');
const Blog = require('../models/blog');
const Post = require('../models/post');

/**
 * Class representing a controller with static functions
 * that process User requests
 */
class UserController {

    static getUser(req, res, next) {
        // Get a given user without his password and also all his blogs 
        async.parallel({
            user: function(callback) {
                User.findById(req.params.id, '-password', callback);
            },
            userBlogs: function(callback) {
                Blog.find({userId: req.params.id}, callback);
            }
        },
        function (err, results) {
            if (err) return next(err);
            if (results.user === null) {
                return next(createError(404, 'User Not Found'));
            }
    
            debug(`Get user ${results.user._id}`);

            res.json({user: results.user, userBlogs: results.userBlogs});
        });
    }

    static createNewUser(req, res, next) {
        // Extract validation errors from a request
        const errors = validationResult(req);
        
        // New user object from a request body
        const user = {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        };

        if (!errors.isEmpty()) {
            debug('User creation validation errors: %j', errors.array());

            return res.status(400).json({errors: errors.array(), user});
        }

        // Hash password to store in the db
        User.generateHash(req.body.password, function(err, hashed) {
            if (err) return next(err);
            
            debug('Hash successfully generated');

            user.password = hashed;
            User.create(user, function(err, newUser) {
                if (err) return next(err);
    
                debug('Created new user %O', newUser);

                res.redirect(201, newUser.url);
            });
        });
    }

    // Updates user information without a password
    static updateUser(req, res, next) {
        // Extract validation errors from a request
        const errors = validationResult(req);

        // Update object of the user
        const user = {
            _id: req.params.id,
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        };

        if (!errors.isEmpty()) {
            debug('User update validation errors: %j', errors.array());

            return res.status(400).json({errors: errors.array(), user});
        }

        User.findByIdAndUpdate(req.params.id, user, function (err, origUser) {
            if (err) return next(err);

            debug(`Updated user ${origUser._id}`);

            res.redirect(200, origUser.url);
        });
    }

    // Deletes all user's posts and blogs too
    // Sends the deleted user
    static deleteUser(req, res, next) {
        // Find all his blogs
        Blog.find({userId: req.params.id}, function(err, blogs) {
            if (err) return next(err);
    
            async.each(blogs, function(blog, callback) {
                debug(`User blog found ${blog._id}`);

                // Delete posts of every his blog
                Post.deleteMany({blogId: blog._id}, function(err) {
                    if (err) return callback(err);
    
                    debug(`Blog ${blog._id} posts deleted`);

                    // And then delete the blog itself
                    blog.remove(function(err, deletedBlog) {
                        if (err) return callback(err);
    
                        debug(`Blog ${deletedBlog._id} deleted`);

                        callback();
                    });
                });
            },
            function(err) {
                if (err) return next(err);
    
                debug(`All blogs of ${req.params.id} user deleted`);

                // All information is deleted, remove the user now
                User.findByIdAndRemove(req.params.id, function(err, foundUser) {
                    if (err) return next(err);
                    if (foundUser === null) return next(createError(404, 'User Not Found'));
    
                    debug(`Deleted user ${foundUser._id}`);

                    res.json({user: foundUser});
                });
            });
        });
    }

}

module.exports = UserController;