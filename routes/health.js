const express = require('express');

const router = express.Router();

// Simple healthcheck endpoint
router.get('/', function (req, res) {
    res.json({status: 'UP'});
});

module.exports = router;