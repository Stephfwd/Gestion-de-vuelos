const request = require('supertest');
const app = require('../src/app');
const { Flight, Airport, Role, User } = require('../src/models');
const { sequelize } = require('../src/config/database');
const bcrypt = require('bcryptjs');

describe('Flight API Tests', () => {
  let adminToken;

  beforeAll(async () => {
    // Sincronizar la base de datos
    await sequelize.sync({ force: false });

    // Asegurarse de que el rol Admin existe (ID 1)
    await Role.findOrCreate({ where: { id: 1, nombre: 'Admin' } });

    // Crear un Admin para las pruebas
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    await User.findOrCreate({
      where: { email: 'admin_test@vuelos.com' },
      defaults: {
        nombre: 'Admin Test',
        password: hashedAdminPassword,
        rol_id: 1,
        telefono: '9999-9999'
      }
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'admin_test@vuelos.com',
      password: 'admin123'
    });
    adminToken = loginRes.body.token;
  });

  // TEST 1: Listado público de vuelos
  it('debería obtener la lista de todos los vuelos disponibles', async () => {
    const res = await request(app).get('/api/flights');
    
    // Valida que la ruta sea pública (no requiere token) y responda 200
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // TEST 2: Creación de vuelo por administrador
  it('debería permitir a un administrador crear un nuevo vuelo', async () => {
    // Obtenemos aeropuertos para el origen y destino
    const airports = await Airport.findAll({ limit: 2 });
    
    // Asegurarnos de que existan al menos 2 aeropuertos
    if (airports.length < 2) {
      await Airport.bulkCreate([
        { nombre: 'Aero 1', ciudad: 'C1', pais: 'P1', codigo: 'A1' },
        { nombre: 'Aero 2', ciudad: 'C2', pais: 'P2', codigo: 'A2' }
      ]);
    }
    
    const updatedAirports = await Airport.findAll({ limit: 2 });

    const flightNum = `TEST-${Math.floor(Math.random() * 10000)}`;
    const res = await request(app)
      .post('/api/flights')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        numero_vuelo: flightNum,
        origen_id: updatedAirports[0].id,
        destino_id: updatedAirports[1].id,
        fecha_salida: new Date(Date.now() + 86400000).toISOString(),
        fecha_llegada: new Date(Date.now() + 90000000).toISOString(),
        capacidad: 100,
        asientos_disponibles: 100,
        precio: 500.00
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.numero_vuelo).toBe(flightNum);
  });

  // TEST 3: Detalle de vuelo específico
  it('debería obtener los detalles de un vuelo incluyendo sus aeropuertos', async () => {
    // Asegurarnos de que exista al menos un vuelo
    let flight = await Flight.findOne();
    
    if (!flight) {
      const airports = await Airport.findAll({ limit: 2 });
      flight = await Flight.create({
        numero_vuelo: 'FL-INIT',
        origen_id: airports[0].id,
        destino_id: airports[1].id,
        fecha_salida: new Date(),
        fecha_llegada: new Date(),
        capacidad: 100,
        asientos_disponibles: 100,
        precio: 100
      });
    }

    const res = await request(app).get(`/api/flights/${flight.id}`);

    expect(res.statusCode).toEqual(200);
    // Valida que el objeto devuelto tenga la información de los aeropuertos asociados
    expect(res.body).toHaveProperty('origen');
    expect(res.body).toHaveProperty('destino');
  });
});
