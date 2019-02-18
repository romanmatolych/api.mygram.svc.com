const express = require('express');

const BlogController = require('../controllers/blog-controller');
const BlogValidator = require('../validators/blog-validator');
const postsRouter = require('../routes/posts');
const {checkBlog} = require('../middlewares/post-middlewares');

const router = express.Router();

/* GET blog page */
router.get('/:id', BlogController.getBlog);

/* Validate and create new blog */
router.post('/',
    BlogValidator.createNewBlog(),
    BlogController.createNewBlog
);

/* Update existing blog + validation */
router.put('/:id', 
    BlogValidator.updateBlog(),
    BlogController.updateBlog
);

/* Delete existing blog */
router.delete('/:id', BlogController.deleteBlog);

// Check if a blog exists and then use routes for posts
router.use('/:id/posts', 
    checkBlog, 
    postsRouter
);

module.exports = router;
