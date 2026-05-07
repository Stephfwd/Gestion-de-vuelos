const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Flight = sequelize.define('Flight', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_vuelo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  origen_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'aeropuertos',
      key: 'id'
    }
  },
  destino_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'aeropuertos',
      key: 'id'
    }
  },
  fecha_salida: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_llegada: {
    type: DataTypes.DATE,
    allowNull: false
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  asientos_disponibles: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  estado: {
    type: DataTypes.ENUM('Programado', 'En Vuelo', 'Aterrizado', 'Cancelado'),
    defaultValue: 'Programado'
  }
}, {
  tableName: 'vuelos',
  timestamps: true
});

module.exports = Flight;
