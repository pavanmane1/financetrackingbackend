const express = require('express');
const CategoryController = require('../controller/categoryController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

// GET all categories
router.get('/', CategoryController.getCategories);

// GET category by ID
router.get('/:id', CategoryController.getCategory);

module.exports = router;
