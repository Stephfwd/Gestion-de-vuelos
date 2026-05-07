const User = require('./User');
const Role = require('./Role');

// Relaciones
Role.hasMany(User, { foreignKey: 'rol_id', as: 'usuarios' });
User.belongsTo(Role, { foreignKey: 'rol_id', as: 'rol' });

module.exports = {
  User,
  Role
};
