const express = require('express');
const router = express.Router();
const createError = require('http-errors');

const postController = require('../controllers/postController');
const Post = require('../models/post');

/* Create new post */
router.post('/', postController.createNewPost);

router.use('/:index', function(req, res, next) {
    Post.find({blogId: res.locals.blogId}).sort({createdAt: 1}).exec(function(err, blogPosts) {
        if (err) return next(err);

        const i = parseInt(req.params.index);
        if (typeof blogPosts[i] === 'undefined') {
            return next(createError(404, 'Post Not Found'));
        } else {
            res.locals.postId = blogPosts[i]._id;
            next();
        } 
    });
});

/* GET post page */
router.get('/:index', postController.getPostPage);

/* Update existing post */
router.put('/:index', postController.updatePost);

/* Delete existing post */
router.delete('/:index', postController.deletePost);

module.exports = router;
