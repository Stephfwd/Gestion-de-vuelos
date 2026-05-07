const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  async register(userData) {
    const { nombre, email, password, rol_id, telefono } = userData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new Error('El correo ya está registrado');

    const hashedPassword = await bcrypt.hash(password, 10);

    return await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol_id: rol_id || 2,
      telefono
    });
  }

  async login(email, password) {
    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Role, as: 'rol' }]
    });

    if (!user) throw new Error('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Contraseña incorrecta');

    const token = jwt.sign(
      { id: user.id, rol: user.rol.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user };
  }
}

module.exports = new AuthService();
