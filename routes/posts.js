const express = require('express');

const PostController = require('../controllers/post-controller');
const PostValidator = require('../validators/post-validator');
const {validateToken, verifyUsersBlog} = require('../middlewares/auth-middlewares');

const router = express.Router({mergeParams: true}); // Get params from the parent route too

// Pass the post to the next middlewares
router.param('postInd', PostController.findPost);

/* GET post page */
router.get('/:postInd', PostController.getPost);

// Token required next
router.use(validateToken);

/* Validate and create new post */
router.post('/', 
    PostValidator.savePost(),
    PostController.createNewPost
);

// Check if user is creating new posts in his own blog 
router.use('/:postInd', verifyUsersBlog);

// Use a single route to handle various HTTP methods 
router.route('/:postInd')
    /* Update existing post with validation */
    .put(
        PostValidator.savePost(),    
        PostController.updatePost
    )
    /* Delete existing post */
    .delete(PostController.deletePost);

module.exports = router;
