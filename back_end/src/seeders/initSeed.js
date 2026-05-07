const { Role, Airport, Flight, User } = require('../models');
const bcrypt = require('bcryptjs');

const initSeed = async () => {
  try {
    console.log('🌱 Iniciando la siembra de datos (Seeding)...');

    // Sincronizar modelos para crear las tablas si no existen (usamos alter para agregar campos nuevos)
    const { sequelize } = require('../config/database');
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas verificadas/actualizadas.');

    // 1. Crear Roles
    const [adminRole, userRole] = await Promise.all([
      Role.findOrCreate({ where: { nombre: 'Admin' } }),
      Role.findOrCreate({ where: { nombre: 'Usuario' } })
    ]);
    console.log('✅ Roles creados.');

    // 2. Crear Aeropuertos
    const airports = await Airport.bulkCreate([
      { nombre: 'Juan Santamaría', ciudad: 'Alajuela', pais: 'Costa Rica', codigo: 'SJO' },
      { nombre: 'Daniel Oduber Quirós', ciudad: 'Liberia', pais: 'Costa Rica', codigo: 'LIR' },
      { nombre: 'Benito Juárez', ciudad: 'Ciudad de México', pais: 'México', codigo: 'MEX' },
      { nombre: 'Adolfo Suárez Madrid-Barajas', ciudad: 'Madrid', pais: 'España', codigo: 'MAD' },
      { nombre: 'John F. Kennedy', ciudad: 'New York', pais: 'USA', codigo: 'JFK' }
    ], { ignoreDuplicates: true });
    console.log('✅ Aeropuertos creados.');

    // 3. Crear Usuario Admin de Prueba
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.findOrCreate({
      where: { email: 'admin@vuelos.com' },
      defaults: {
        nombre: 'Administrador Sistema',
        password: hashedPassword,
        rol_id: 1, // Admin
        telefono: '8888-8888'
      }
    });
    console.log('✅ Usuario admin creado (admin@vuelos.com / admin123).');

    // 4. Crear Vuelos de Prueba
    const sjo = await Airport.findOne({ where: { codigo: 'SJO' } });
    const mex = await Airport.findOne({ where: { codigo: 'MEX' } });
    const mad = await Airport.findOne({ where: { codigo: 'MAD' } });

    if (sjo && mex && mad) {
      await Flight.bulkCreate([
        {
          numero_vuelo: 'CR-101',
          origen_id: sjo.id,
          destino_id: mex.id,
          fecha_salida: new Date(Date.now() + 86400000), // Mañana
          fecha_llegada: new Date(Date.now() + 97200000),
          capacidad: 150,
          asientos_disponibles: 150,
          precio: 250.00,
          estado: 'Programado'
        },
        {
          numero_vuelo: 'IB-502',
          origen_id: mex.id,
          destino_id: mad.id,
          fecha_salida: new Date(Date.now() + 172800000), // Pasado mañana
          fecha_llegada: new Date(Date.now() + 216000000),
          capacidad: 300,
          asientos_disponibles: 300,
          precio: 850.00,
          estado: 'Programado'
        }
      ], { ignoreDuplicates: true });
      console.log('✅ Vuelos de prueba creados.');
    }

    console.log('✨ Proceso de seeding completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    process.exit(1);
  }
};

initSeed();
