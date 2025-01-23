// routes/categoryRoutes.js
const express = require('express');
const categoryController = require('../controllers/categoryController.js');

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);
router.delete('/:categoryId', categoryController.deleteCategory);

module.exports = router;
