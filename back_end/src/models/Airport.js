const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Airport = sequelize.define('Airport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pais: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'aeropuertos',
  timestamps: true
});

module.exports = Airport;
