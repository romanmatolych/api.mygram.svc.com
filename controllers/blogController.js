const parallel = require('async/parallel');
const createError = require('http-errors');
const {body, validationResult} = require('express-validator/check');

const Blog = require('../models/blog');
const Post = require('../models/post');

exports.getBlogPage = function(req, res, next) {
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

        res.json({blog: results.blog, blogPosts: results.blogPosts});
    });
};

// POST (create new blog)
exports.createNewBlog = [
    // Body validation + sanitization
    body('userId')
        .not().isEmpty()
        .trim()
        .isMongoId(),
    body('name')
        .not().isEmpty()
        .trim()
        .escape(),
    // TODO: Theme

    function(req, res, next) {
        const errors = validationResult(req);
        
        const blog = {
            userId: req.body.userId,
            name: req.body.name
        };

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), blog});
        }
            
        Blog.create(blog, function(err, newBlog) {
            if (err) return next(err);

            res.redirect(201, newBlog.url);
        });
    }
];

exports.updateBlog = [
    // Body validation + sanitization
    body('name')
        .not().isEmpty()
        .trim()
        .escape(),
    // TODO: Theme

    function(req, res, next) {
        const errors = validationResult(req);
        
        const blog = {
            _id: req.params.id,
            name: req.body.name
        };

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), blog});
        }
            
        Blog.findByIdAndUpdate(req.params.id, blog, function(err, updatedBlog) {
            if (err) return next(err);

            res.redirect(200, updatedBlog.url);
        });
    }
];

// Delete a blog with all it's posts
exports.deleteBlog = function(req, res, next) {
    Post.deleteMany({blogId: req.params.id}, function(err) {
        if (err) return next(err);

        Blog.findByIdAndRemove(req.params.id, function(err, blog) {
            if (err) return next(err);
            if (blog === null) return next(createError(404, 'Blog Not Found'));

            res.json({blog});
        });
    });
}