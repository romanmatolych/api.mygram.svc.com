const async = require('async');
const createError = require('http-errors');
const {validationResult} = require('express-validator/check');
const debug = require('debug')('api.mygram.svc.com:user-controller');
const {Types: {ObjectId}} = require('mongoose');

const User = require('../models/user');
const Blog = require('../models/blog');
const Post = require('../models/post');

/**
 * Class representing a controller with static functions
 * that process User requests
 */
class UserController {

    static findUser(req, res, next, userId) {
        // :userId must be a valid ObjectId
        if (!ObjectId.isValid(userId)) return next(createError(400));
        // Get a given user without his password and save him in local variables
        User.findById(userId, '-password', function(err, user) {
            if (err) return next(err);
            if (user === null) return next(createError(404, 'User Not Found'));
    
            res.locals.user = user;
            next();
        });
    }

    static getUser(req, res, next) {
        // Get also user's blogs and send this info
        const user = res.locals.user;
        Blog.find({userId: user._id}, function(err, blogs) {
            if (err) return next(err);
    
            res.json({user, blogs});
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
                res.status(201).json({user: newUser});
            });
        });
    }

    // Updates user information without a password
    static updateUser(req, res, next) {
        // Extract validation errors from a request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            debug('User update validation errors: %j', errors.array());
            return res.status(400).json({errors: errors.array(), user: req.body});
        }

        // Update object of the user
        const user = res.locals.user;
        user.username = req.body.username;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.save(function(err, savedUser) {
            if (err) return next(err);

            debug(`Updated user ${savedUser._id}`);
            res.redirect(200, savedUser.url);
        });
    }

    // Deletes all user's posts and blogs too
    // Sends the deleted user
    static deleteUser(req, res, next) {
        const user = res.locals.user;
        // Find all his blogs
        Blog.find({userId: user._id}, function(err, blogs) {
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
    
                debug(`All blogs of ${user._id} user deleted`);
                // All information is deleted, remove the user now
                user.remove(function(err, removedUser) {
                    if (err) return next(err);

                    debug(`Deleted user ${removedUser._id}`);
                    res.json({user: removedUser});
                });
            });
        });
    }

}

module.exports = UserController;