const { Payment, Booking } = require('../models');

class PaymentService {
  async process(paymentData) {
    const { reserva_id, monto, metodo_pago } = paymentData;

    const booking = await Booking.findByPk(reserva_id);
    if (!booking) throw new Error('Reserva no encontrada');

    const payment = await Payment.create({
      reserva_id,
      monto,
      metodo_pago,
      estado: 'Completado',
      fecha_pago: new Date()
    });

    await booking.update({ estado: 'Confirmada' });

    return payment;
  }

  async getByBookingId(bookingId) {
    const payment = await Payment.findOne({ where: { reserva_id: bookingId } });
    if (!payment) throw new Error('No se encontró pago para esta reserva');
    return payment;
  }
}

module.exports = new PaymentService();
