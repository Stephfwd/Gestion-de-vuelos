'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vuelos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numero_vuelo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      origen_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'aeropuertos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      destino_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'aeropuertos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha_salida: {
        type: Sequelize.DATE,
        allowNull: false
      },
      fecha_llegada: {
        type: Sequelize.DATE,
        allowNull: false
      },
      capacidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      asientos_disponibles: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('Programado', 'En Vuelo', 'Aterrizado', 'Cancelado'),
        defaultValue: 'Programado'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vuelos');
  }
};
