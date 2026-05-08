const request = require('supertest');
const app = require('../src/app');
const { User, Role } = require('../src/models');
const { sequelize } = require('../src/config/database');
const bcrypt = require('bcryptjs');

describe('Login API Tests', () => {
  // Configuración antes de correr los tests
  beforeAll(async () => {
    // Sincronizar la base de datos (puedes usar force: false si no quieres borrar datos existentes)
    await sequelize.sync({ force: false });

    // Asegurarse de que existan los roles
    await Role.findOrCreate({ where: { id: 1, nombre: 'Admin' } });
    await Role.findOrCreate({ where: { id: 2, nombre: 'Usuario' } });

    // Crear un usuario de prueba si no existe
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.findOrCreate({
      where: { email: 'testuser@example.com' },
      defaults: {
        nombre: 'Usuario de Prueba',
        password: hashedPassword,
        rol_id: 2,
        telefono: '12345678'
      }
    });
  });

  describe('POST /api/auth/login', () => {
    
    it('debería iniciar sesión correctamente con credenciales válidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('testuser@example.com');
      expect(res.body.user).toHaveProperty('rol');
    });

    it('debería fallar con una contraseña incorrecta', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Contraseña incorrecta');
    });

    it('debería fallar si el usuario no existe', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'noexiste@vuelos.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Usuario no encontrado');
    });

    it('debería fallar si faltan campos obligatorios', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com'
          // falta el password
        });

      expect(res.statusCode).toEqual(400); // 400 por error de validación del middleware
      expect(res.body).toHaveProperty('errors');
    });
  });
});
