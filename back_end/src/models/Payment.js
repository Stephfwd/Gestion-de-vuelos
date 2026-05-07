const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reserva_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'reservas',
      key: 'id'
    }
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  metodo_pago: {
    type: DataTypes.ENUM('Tarjeta', 'Transferencia', 'PayPal'),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'Completado', 'Rechazado'),
    defaultValue: 'Pendiente'
  },
  fecha_pago: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'pagos',
  timestamps: true
});

module.exports = Payment;
