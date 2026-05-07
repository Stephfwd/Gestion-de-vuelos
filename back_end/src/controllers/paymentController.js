const { Payment, Booking } = require('../models');

exports.processPayment = async (req, res) => {
  try {
    const { reserva_id, monto, metodo_pago } = req.body;

    const booking = await Booking.findByPk(reserva_id);
    if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });

    // Crear registro de pago
    const payment = await Payment.create({
      reserva_id,
      monto,
      metodo_pago,
      estado: 'Completado', // Simulando pago exitoso
      fecha_pago: new Date()
    });

    // Actualizar estado de la reserva a Confirmada
    await booking.update({ estado: 'Confirmada' });

    res.status(201).json({
      message: 'Pago procesado y reserva confirmada',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar el pago', error: error.message });
  }
};

exports.getPaymentByBooking = async (req, res) => {
  try {
    const payment = await Payment.findOne({ where: { reserva_id: req.params.bookingId } });
    if (!payment) return res.status(404).json({ message: 'No se encontró pago para esta reserva' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el pago', error: error.message });
  }
};
