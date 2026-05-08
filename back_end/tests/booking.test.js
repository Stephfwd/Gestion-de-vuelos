const request = require('supertest');
const app = require('../src/app');
const { Booking, Flight, User } = require('../src/models');
const { sequelize } = require('../src/config/database');

describe('Booking API Tests', () => {
  let token;
  let flightId;

  beforeAll(async () => {
    await sequelize.sync({ force: false });

    // 1. Necesitamos un token para las rutas protegidas
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'testuser@example.com',
      password: 'password123'
    });
    token = loginRes.body.token;

    // 2. Necesitamos un vuelo real para reservar
    const flight = await Flight.findOne();
    flightId = flight.id;
  });

  // TEST 1: Creación de reserva exitosa
  it('debería crear una nueva reserva correctamente', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vuelo_id: flightId,
        cantidad_asientos: 2
      });

    // Valida que se cree el recurso (201 Created)
    expect(res.statusCode).toEqual(201);
    // Valida que la reserva esté vinculada al vuelo correcto
    expect(res.body.vuelo_id).toBe(flightId);
    // Valida que el estado inicial sea 'Pendiente'
    expect(res.body.estado).toBe('Pendiente');
  });

  // TEST 2: Listado de mis reservas
  it('debería obtener la lista de reservas del usuario logueado', async () => {
    const res = await request(app)
      .get('/api/bookings/my-bookings')
      .set('Authorization', `Bearer ${token}`);

    // Valida que responda con éxito
    expect(res.statusCode).toEqual(200);
    // Valida que sea un array y contenga al menos la reserva que acabamos de hacer
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // TEST 3: Lógica de Negocio (Error por falta de asientos)
  it('debería fallar si se intentan reservar más asientos de los disponibles', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vuelo_id: flightId,
        cantidad_asientos: 9999 // Cantidad imposible
      });

    // Valida que el servidor rechace la petición (400 Bad Request)
    expect(res.statusCode).toEqual(400);
    // Valida que el mensaje de error sea el esperado por la lógica de negocio
    expect(res.body).toHaveProperty('message', 'No hay suficientes asientos disponibles');
  });
});
