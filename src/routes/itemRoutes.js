// routes/itemRoutes.js
const express = require('express');
const itemController = require('../controllers/itemController.js');

const router = express.Router();

router.get('/', itemController.getAllItems);
router.post('/', itemController.createItem);
router.delete('/:itemId', itemController.deleteItem);

module.exports = router;
