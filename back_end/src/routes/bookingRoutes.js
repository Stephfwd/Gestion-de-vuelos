const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware); // Todas las rutas de reservas requieren login

router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getUserBookings);
router.post('/cancel/:id', bookingController.cancelBooking);

module.exports = router;
