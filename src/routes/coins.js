const express = require('express');
const router = express.Router();
const {
    createPaymentIntent,
    confirmPurchase
} = require('../controllers/coins');
const { protect, authorize } = require('../middleware/auth');

router.post('/create-payment-intent', protect, authorize('teacher'), createPaymentIntent);
router.post('/confirm-purchase', protect, authorize('teacher'), confirmPurchase);

module.exports = router; 