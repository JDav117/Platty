const app = require('./src/app');
const { testConnection } = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await testConnection();
    console.log('Conectado a Supabase (PostgreSQL)');

    app.listen(PORT, () => {
      console.log(`Platty API corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err.message);
    process.exit(1);
  }
};

start();
