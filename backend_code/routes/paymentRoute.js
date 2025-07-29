const express = require('express');
const PaymentController = require('../controllers/paymentController.js');
const { authGuard } = require('../middleware/authGuard.js');

const router = express.Router();

router.post('/checkout', authGuard, PaymentController.checkout);
router.get('/verify-esewa', PaymentController.verifyEsewa);

module.exports = router;
