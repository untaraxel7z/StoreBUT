const app = require('./src/app');
const initDatabase = require('./src/config/initDatabase');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Sincroniza banco de dados
    await initDatabase();

    // Inicia servidor
    app.listen(PORT, () => {
      console.log(`\n✓ Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('✗ Erro ao iniciar servidor:', error.message);
    process.exit(1);
  }
};

startServer();
 