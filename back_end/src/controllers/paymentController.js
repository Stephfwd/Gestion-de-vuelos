const paymentService = require('../services/paymentService');

exports.processPayment = async (req, res) => {
  try {
    const payment = await paymentService.process(req.body);
    res.status(201).json({
      message: 'Pago procesado y reserva confirmada',
      payment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPaymentByBooking = async (req, res) => {
  try {
    const payment = await paymentService.getByBookingId(req.params.bookingId);
    res.json(payment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
