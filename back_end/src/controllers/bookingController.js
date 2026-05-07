const { Booking, Flight, User, Airport } = require('../models');
const { sequelize } = require('../config/database');

exports.createBooking = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { vuelo_id, cantidad_asientos } = req.body;
    const usuario_id = req.user.id; // Obtenido del token

    const flight = await Flight.findByPk(vuelo_id, { transaction: t });
    if (!flight) {
      await t.rollback();
      return res.status(404).json({ message: 'Vuelo no encontrado' });
    }

    if (flight.asientos_disponibles < cantidad_asientos) {
      await t.rollback();
      return res.status(400).json({ message: 'No hay suficientes asientos disponibles' });
    }

    // Crear reserva
    const booking = await Booking.create({
      usuario_id,
      vuelo_id,
      cantidad_asientos,
      estado: 'Pendiente'
    }, { transaction: t });

    // Actualizar disponibilidad del vuelo
    await flight.update({
      asientos_disponibles: flight.asientos_disponibles - cantidad_asientos
    }, { transaction: t });

    await t.commit();
    res.status(201).json(booking);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { usuario_id: req.user.id },
      include: [
        { 
          model: Flight, 
          as: 'vuelo',
          include: [
            { model: Airport, as: 'origen' },
            { model: Airport, as: 'destino' }
          ]
        }
      ]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tus reservas', error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const booking = await Booking.findByPk(req.params.id, { transaction: t });
    if (!booking) {
      await t.rollback();
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    if (booking.estado === 'Cancelada') {
      await t.rollback();
      return res.status(400).json({ message: 'La reserva ya está cancelada' });
    }

    // Devolver asientos al vuelo
    const flight = await Flight.findByPk(booking.vuelo_id, { transaction: t });
    await flight.update({
      asientos_disponibles: flight.asientos_disponibles + booking.cantidad_asientos
    }, { transaction: t });

    await booking.update({ estado: 'Cancelada' }, { transaction: t });

    await t.commit();
    res.json({ message: 'Reserva cancelada exitosamente' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Error al cancelar la reserva', error: error.message });
  }
};
