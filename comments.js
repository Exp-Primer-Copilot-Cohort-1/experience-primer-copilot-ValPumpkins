// Create web server

// Import modules
const express = require('express');
const { check, validationResult } = require('express-validator');
const { Comment } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// Construct router instance
const router = express.Router();

// GET route to return all comments for a specific course
router.get(
  '/courses/:id/comments',
  asyncHandler(async (req, res) => {
    const comments = await Comment.findAll({
      where: {
        courseId: req.params.id,
      },
    });
    res.status(200).json(comments);
  })
);

// POST route to create a new comment
router.post(
  '/courses/:id/comments',
  authenticateUser,
  [
    check('comment').exists().withMessage('Please provide a comment'),
    check('userId').exists().withMessage('Please provide a userId'),
    check('courseId').exists().withMessage('Please provide a courseId'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400).json({ errors: errorMessages });
    } else {
      const comment = await Comment.create(req.body);
      res
        .status(201)
        .location(`/courses/${comment.courseId}`)
        .end();
    }
  })
);

// Export router
module.exports = router;