const request = require('supertest');
const app = require('../src/app');
const { Payment, Booking, User, Flight } = require('../src/models');
const { sequelize } = require('../src/config/database');

describe('Payment API Tests', () => {
  let token;
  let bookingId;

  beforeAll(async () => {
    // Sincronizar
    await sequelize.sync({ force: false });

    // Login para obtener token
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'password123'
    });
    token = loginRes.body.token;

    // Crear una reserva fresca para la prueba
    const flight = await Flight.findOne();
    const user = await User.findOne({ where: { email: 'testuser@example.com' } });
    
    if (!flight || !user) {
        throw new Error('No se encontró vuelo o usuario para el test de pago');
    }

    const booking = await Booking.create({
      usuario_id: user.id,
      vuelo_id: flight.id,
      cantidad_asientos: 1,
      estado: 'Pendiente'
    });
    bookingId = booking.id;
  });

  it('debería procesar un pago correctamente y confirmar la reserva', async () => {
    const res = await request(app)
      .post('/api/payments/process')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reserva_id: bookingId,
        monto: 500.00,
        metodo_pago: 'Tarjeta'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.payment).toHaveProperty('id');
    
    // Verificar que la reserva se confirmó
    const updatedBooking = await Booking.findByPk(bookingId);
    expect(updatedBooking.estado).toBe('Confirmada');
  });

  it('debería obtener los detalles del pago de una reserva específica', async () => {
    const res = await request(app)
      .get(`/api/payments/booking/${bookingId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.reserva_id).toBe(bookingId);
  });

  it('debería fallar si la reserva no existe', async () => {
    const res = await request(app)
      .post('/api/payments/process')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reserva_id: 999999,
        monto: 100,
        metodo_pago: 'Efectivo'
      });

    expect(res.statusCode).toEqual(400);
  });
});
