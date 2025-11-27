const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clientController');
const { validateRegister, validateLogin } = require('../validators/clientValidator');

router.post('/register', validateRegister, ClientController.register);
router.post('/login', validateLogin, ClientController.login);
router.get('/total', ClientController.getTotal);

module.exports = router;

