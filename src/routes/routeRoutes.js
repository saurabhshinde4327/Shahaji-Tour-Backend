const express = require('express');
const router = express.Router();
const RouteController = require('../controllers/routeController');
const {
  validateCreateRoute,
  validateUpdateRoute,
  validateUpdatePrices,
  validateSearchRoute
} = require('../validators/routeValidator');

router.post('/', validateCreateRoute, RouteController.create);
router.get('/', RouteController.getAll);
router.get('/search', validateSearchRoute, RouteController.search);
router.get('/:id', RouteController.getById);
router.put('/:id', validateUpdateRoute, RouteController.update);
router.put('/:id/prices', validateUpdatePrices, RouteController.updatePrices);
router.delete('/:id', RouteController.delete);

module.exports = router;

