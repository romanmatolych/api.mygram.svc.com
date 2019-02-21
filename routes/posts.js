const express = require('express');

const PostController = require('../controllers/post-controller');
const PostValidator = require('../validators/post-validator');
const {findPost} = require('../middlewares/post-middlewares');

const router = express.Router();

/* Validate and create new post */
router.post('/', 
    PostValidator.savePost(),
    PostController.createNewPost
);

// Pass the post's id to the next middlewares
router.use('/:index', findPost);

/* GET post page */
router.get('/:index', PostController.getPost);

/* Update existing post with validation */
router.put('/:index', 
    PostValidator.savePost(),    
    PostController.updatePost
);

/* Delete existing post */
router.delete('/:index', PostController.deletePost);

module.exports = router;
