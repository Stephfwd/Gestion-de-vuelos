const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/process', paymentController.processPayment);
router.get('/booking/:bookingId', paymentController.getPaymentByBooking);

module.exports = router;
