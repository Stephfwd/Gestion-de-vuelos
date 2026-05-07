const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');

router.get('/', flightController.getAllFlights);
router.get('/:id', flightController.getFlightById);

// Rutas protegidas (Solo Admin)
router.post('/', authMiddleware, isAdmin, flightController.createFlight);
router.put('/:id', authMiddleware, isAdmin, flightController.updateFlight);

module.exports = router;
