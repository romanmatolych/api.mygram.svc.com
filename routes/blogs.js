const express = require('express');
const createError = require('http-errors');
const router = express.Router();

const blogController = require('../controllers/blogController');
const postsRouter = require('../routes/posts');
const Blog = require('../models/blog');

/* GET blog page */
router.get('/:id', blogController.getBlogPage);

/* Create new blog */
router.post('/', blogController.createNewBlog);

/* Update existing blog */
router.put('/:id', blogController.updateBlog);

/* Delete existing blog */
router.delete('/:id', blogController.deleteBlog);

router.use('/:id/posts', function(req, res, next) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) return next(err);
        if (blog === null) return next(createError(404, 'Blog Not Found'));

        res.locals.blogId = req.params.id;
        next();
    });
}, postsRouter);

module.exports = router;
