const User = require('./User');
const Role = require('./Role');
const Airport = require('./Airport');
const Flight = require('./Flight');
const Booking = require('./Booking');
const Payment = require('./Payment');

// 1. Roles y Usuarios
Role.hasMany(User, { foreignKey: 'rol_id', as: 'usuarios' });
User.belongsTo(Role, { foreignKey: 'rol_id', as: 'rol' });

// 2. Aeropuertos y Vuelos
// Un aeropuerto puede ser origen de muchos vuelos
Airport.hasMany(Flight, { foreignKey: 'origen_id', as: 'vuelos_salida' });
Flight.belongsTo(Airport, { foreignKey: 'origen_id', as: 'origen' });

// Un aeropuerto puede ser destino de muchos vuelos
Airport.hasMany(Flight, { foreignKey: 'destino_id', as: 'vuelos_llegada' });
Flight.belongsTo(Airport, { foreignKey: 'destino_id', as: 'destino' });

// 3. Usuarios, Vuelos y Reservas
User.hasMany(Booking, { foreignKey: 'usuario_id', as: 'reservas' });
Booking.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

Flight.hasMany(Booking, { foreignKey: 'vuelo_id', as: 'reservas' });
Booking.belongsTo(Flight, { foreignKey: 'vuelo_id', as: 'vuelo' });

// 4. Reservas y Pagos (Relación 1 a 1)
Booking.hasOne(Payment, { foreignKey: 'reserva_id', as: 'pago' });
Payment.belongsTo(Booking, { foreignKey: 'reserva_id', as: 'reserva' });

module.exports = {
  User,
  Role,
  Airport,
  Flight,
  Booking,
  Payment
};
