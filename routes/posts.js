const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

/* GET post page */
router.get('/:index', postController.getPostPage);

/* Create new post */
router.post('/', postController.createNewPost);

/* Update existing post */
router.put('/:index', postController.updatePost);

/* Delete existing post */
router.delete('/:index', postController.deletePost);

module.exports = router;
