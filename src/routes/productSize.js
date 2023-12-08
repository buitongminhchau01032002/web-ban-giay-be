const express = require('express');
const router = express.Router();
const productSizeController = require('../controllers/productSizeController');

router.post('/', productSizeController.create);
router.delete('/:id', productSizeController.destroy);

module.exports = router;
