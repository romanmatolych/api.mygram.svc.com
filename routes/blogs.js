const express = require('express');

const BlogController = require('../controllers/blog-controller');
const BlogValidator = require('../validators/blog-validator');
const postsRouter = require('../routes/posts');
const {validateToken, verifyUsersBlog} = require('../middlewares/auth-middlewares');

const router = express.Router();

// Preload a blog from the database
router.param('blogId', BlogController.findBlog);

/* GET blog page */
router.get('/:blogId', BlogController.getBlog);

// Use routes for posts
router.use('/:blogId/posts', postsRouter);

// A user must be logged in for next operations 
router.use(validateToken);

/* Validate and create new blog */
router.post('/',
    BlogValidator.createNewBlog(),
    BlogController.createNewBlog
);

// Check if logged-in user is modifying his own blog
router.use('/:blogId', verifyUsersBlog);

router.route('/:blogId')
    /* Update existing blog + validation */
    .put( 
        BlogValidator.updateBlog(),
        BlogController.updateBlog
    )
    /* Delete existing blog */
    .delete(BlogController.deleteBlog);

module.exports = router;
