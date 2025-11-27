const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transactionController');
const { validateCreateTransaction } = require('../validators/transactionValidator');

router.post('/', validateCreateTransaction, TransactionController.create);
router.get('/', TransactionController.getAll);
router.get('/client/:clientId', TransactionController.getByClient);
router.get('/:id', TransactionController.getById);

module.exports = router;

