const request = require('supertest');
const app = require('../src/app');

describe('API Root Endpoint', () => {
  it('should return a welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Bienvenido a la API de Gestión de Vuelos');
  });
});
