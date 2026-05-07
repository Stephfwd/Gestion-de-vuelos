const app = require('./src/app');
const { connectDB, sequelize } = require('./src/config/database');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Sincronizar modelos
    // En desarrollo puedes usar { force: false } o { alter: true }
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
};

startServer();
