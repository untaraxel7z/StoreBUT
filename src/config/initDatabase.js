const sequelize = require('./database');
const path = require('path');

/**
 * Inicializa e sincroniza todos os modelos do banco
 */
const initDatabase = async () => {
  try {
    // Importar modelos explicitamente
    const User = require('../models/User');
    const Product = require('../models/ProductSequelize');

    // Sincronizar e ALTERAR tabelas existentes para adicionar novas colunas
    await sequelize.sync({ alter: true });
    console.log('✓ Banco de dados sincronizado e atualizado');
  } catch (error) {
    console.error('✗ Erro ao sincronizar banco:', error.message);
    // Não lançar erro, apenas continuar
  }
};

module.exports = initDatabase;
