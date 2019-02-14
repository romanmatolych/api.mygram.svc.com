const async = require('async');
const createError = require('http-errors');
const {body, validationResult} = require('express-validator/check');

const User = require('../models/user');
const Blog = require('../models/blog');
const Post = require('../models/post');

// GET user
exports.getUserPage = function(req, res, next) {
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

        res.json({user: results.user, userBlogs: results.userBlogs});
    });
};

// POST (create new user)
exports.createNewUser = [
    // Body validation + sanitization
    body('username')
        .isAlphanumeric()
        .isLength({min: 4})
        .trim(),
    body(['firstName', 'lastName'])
        .not().isEmpty()
        .trim()
        .escape(),
    body('email')
        .isEmail()
        .normalizeEmail(),
    body('password')
        .not().isEmpty(),

    function(req, res, next) {
        const errors = validationResult(req);
        
        const user = {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        };

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), user});
        }

        User.generateHash(req.body.password, function(err, hashed) {
            if (err) return next(err);
            
            user.password = hashed;
            User.create(user, function(err, usr) {
                if (err) return next(err);
    
                res.redirect(201, usr.url);
            });
        });
    }
];

// Update user information without a password
exports.updateUser = [
    // Body validation + sanitization
    body('username')
        .isAlphanumeric()
        .isLength({min: 4})
        .trim(),
    body(['firstName', 'lastName'])
        .not().isEmpty()
        .trim()
        .escape(),
    body('email')
        .isEmail()
        .normalizeEmail(),

    function(req, res, next) {
        const errors = validationResult(req);

        const user = {
            _id: req.params.id,
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        };

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), user});
        }

        User.findByIdAndUpdate(req.params.id, user, function (err, usr) {
            if (err) return next(err);

            res.redirect(200, usr.url);
        });
    }
];

// Deletes all user's posts and blogs too
exports.deleteUser = function(req, res, next) {
    Blog.find({userId: req.params.id}, function(err, blogs) {
        if (err) return next(err);

        async.each(blogs, function(blog, callback) {
            // Delete user's posts
            Post.deleteMany({blogId: blog._id}, function(err) {
                if (err) return callback(err);

                // Delete each of his blogs
                blog.remove(function(err) {
                    if (err) return callback(err);

                    callback();
                });
            });
        },
        function(err) {
            if (err) return next(err);

            // All info is deleted, remove the user now
            User.findByIdAndRemove(req.params.id, function(err, user) {
                if (err) return next(err);
                if (user === null) return next(createError(404, 'User Not Found'));

                res.json({user});
            })
        });
    });
}