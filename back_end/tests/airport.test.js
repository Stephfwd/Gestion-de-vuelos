const request = require('supertest');
const app = require('../src/app');
const { Airport } = require('../src/models');
const { sequelize } = require('../src/config/database');

describe('Airport API Tests', () => {
  
  beforeAll(async () => {
    // Sincronizar la base de datos antes de las pruebas
    await sequelize.sync({ force: false });
    
    // Validar que exista al menos un aeropuerto para las pruebas de ID
    const airport = await Airport.findOne({ where: { codigo: 'SJO' } });
    if (!airport) {
      await Airport.create({
        nombre: 'Juan Santamaría',
        ciudad: 'Alajuela',
        pais: 'Costa Rica',
        codigo: 'SJO'
      });
    }
  });

  describe('GET /api/airports', () => {
    // TEST 1: Validación de listado general
    it('debería obtener la lista de todos los aeropuertos', async () => {
      const res = await request(app).get('/api/airports');
      
      // Valida que el servidor responda con éxito 
      expect(res.statusCode).toEqual(200);
      // Valida que la respuesta sea un Array 
      expect(Array.isArray(res.body)).toBe(true);
      // Valida que la lista no esté vacía
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/airports/:id', () => {
    // TEST 2: Validación de búsqueda por ID (Caso exitoso)
    it('debería obtener un aeropuerto por su ID', async () => {
      // Primero buscamos un ID real en la base de datos
      const airport = await Airport.findOne();
      
      const res = await request(app).get(`/api/airports/${airport.id}`);
      
      // Valida que responda 200 OK
      expect(res.statusCode).toEqual(200);
      // Valida que los datos devueltos coincidan exactamente con la DB
      expect(res.body.nombre).toBe(airport.nombre);
      expect(res.body.codigo).toBe(airport.codigo);
    });

    // TEST 3: Validación de manejo de errores (Caso fallido)
    it('debería devolver 404 si el aeropuerto no existe', async () => {
      // Consultamos un ID que sabemos que es imposible que exista
      const res = await request(app).get('/api/airports/999999');
      
      // Valida que el servidor devuelva 404 (Not Found)
      expect(res.statusCode).toEqual(404);
      // Valida que el mensaje de error sea el correcto para el usuario
      expect(res.body).toHaveProperty('message', 'Aeropuerto no encontrado');
    });
  });
});
