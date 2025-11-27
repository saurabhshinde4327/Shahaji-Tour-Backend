const express = require('express');
const router = express.Router();
const SliderController = require('../controllers/sliderController');

router.get('/', SliderController.getAll);
router.get('/:id', SliderController.getById);
router.post('/', SliderController.create);
router.put('/:id', SliderController.update);
router.delete('/:id', SliderController.delete);

module.exports = router;

