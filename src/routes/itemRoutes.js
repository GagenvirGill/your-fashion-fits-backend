// routes/itemRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const itemController = require('../controllers/itemController.js');

const uploadFolder = './uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
  
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 50 * 1024 * 1024 } 
});

const router = express.Router();

router.get('/', itemController.getAllItems);
router.post('/', upload.single('image'), itemController.createItem);
router.delete('/:itemId', itemController.deleteItem);

router.get('/:itemId/categories', itemController.getItemsCategories);
router.post('/:itemId/categories', itemController.addItemToCategories);
router.delete('/:itemId/categories', itemController.removeItemFromCategories);

module.exports = router;
