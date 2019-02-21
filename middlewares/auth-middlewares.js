const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Blog = require('../models/blog');

/**
 * Reads Bearer token, verifies it and passes the payload further
 * If a user is not logged-in, creates 401 Unauthorized
 */
exports.validateToken = function(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // Authorization: Bearer <token>
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;
        const verifyOptions = {
            algorithms: ["HS256"],
        };

        jwt.verify(token, secret, verifyOptions, function(err, payload) {
            if (err) return next(err);

            res.locals.payload = payload;
            next();
        });
    } else {
        next(createError(401));
    }
};

/**
 * Checks if userId from params is authorized user's id
 * to protect operations of modifying user's info
 */
exports.verifyUser = function(req, res, next) {
    const payload = res.locals.payload;
    if (payload && payload.userId === req.params.userId) {
        next();    
    } else {
        next(createError(403));
    }
};

exports.verifyUsersBlog = function(req, res, next) {
    const payload = res.locals.payload;
    if (payload && payload.userId) {
        Blog.findOne({_id: req.params.blogId, userId: payload.userId}, function(err, blog) {
            if (err) return next(err);
            if (blog === null) return next(createError(404, 'Blog Not Found'));

            next();
        });
    } else {
        next(createError(403));
    }
};