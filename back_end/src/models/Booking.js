const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  vuelo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vuelos',
      key: 'id'
    }
  },
  cantidad_asientos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'Confirmada', 'Cancelada'),
    defaultValue: 'Pendiente'
  },
  fecha_reserva: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'reservas',
  timestamps: true
});

module.exports = Booking;
