const express = require('express');
const { googleAuth } = require('../controllers/authController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/google', asyncHandler(googleAuth));

module.exports = router;
