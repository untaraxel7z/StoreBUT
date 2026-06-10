const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const mysql2 = require('mysql2/promise');
require('dotenv').config();

const migrateDatabase = async () => {
  let sequelize;
  let connection;
  
  try {
    const dbName = process.env.DB_NAME || 'SNKRS';
    const dbUser = process.env.DB_USER || 'root';
    const dbPass = process.env.DB_PASS || '';
    const dbHost = process.env.DB_HOST || '127.0.0.1';
    const dbPort = process.env.DB_PORT || 3306;

    // Passo 1: Cria o banco se não existir
    console.log('=== MIGRAÇÃO DE BANCO DE DADOS ===\n');
    console.log('Conectando ao MySQL...');
    connection = await mysql2.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPass,
    });

    console.log('✓ Conectado ao MySQL');

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✓ Banco "${dbName}" verificado/criado`);
    await connection.end();

    // Passo 2: Conecta ao banco específico
    sequelize = new Sequelize(dbName, dbUser, dbPass, {
      host: dbHost,
      port: dbPort,
      dialect: 'mysql',
      dialectModule: require('mysql2'),
      logging: false,
    });

    await sequelize.authenticate();
    console.log('✓ Conectado ao banco de dados\n');

    // Passo 3: Define os modelos
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        lowercase: true,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
      },
    }, {
      tableName: 'users',
      timestamps: true,
      underscored: true,
    });

    const Product = sequelize.define('Product', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      style: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sku: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM('disponivel', 'indisponivel', 'descontinuado'),
        defaultValue: 'disponivel',
      },
      images: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    }, {
      tableName: 'products',
      timestamps: true,
      underscored: true,
    });

    // Passo 4: Sincroniza as tabelas
    console.log('Criando tabelas...');
    await sequelize.sync({ force: false });
    console.log('✓ Tabela "users" verificada/criada');
    console.log('✓ Tabela "products" verificada/criada\n');

    // Passo 5: Lê dados do JSON
    const jsonPath = path.join(__dirname, 'products.json');
    if (!fs.existsSync(jsonPath)) {
      console.log('⚠ Arquivo products.json não encontrado. Pulando migração de produtos.');
      await sequelize.close();
      process.exit(0);
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`Lido ${jsonData.length} produtos do JSON`);

    // Passo 6: Verifica quantos produtos já existem
    const existingCount = await Product.count();
    console.log(`${existingCount} produtos já existem no banco`);

    if (existingCount > 0) {
      console.log('⚠ Banco já contém dados. Pulando inserção de produtos.\n');
      await sequelize.close();
      console.log('=== MIGRAÇÃO CONCLUÍDA ===');
      process.exit(0);
    }

    // Passo 7: Insere produtos
    console.log(`\nInserindo ${jsonData.length} produtos no banco...`);
    let insertedCount = 0;
    
    for (const product of jsonData) {
      try {
        await Product.create({
          name: product.name,
          style: product.style,
          price: parseFloat(product.price),
          description: product.description,
          sku: product.sku,
          status: product.status || 'disponivel',
          images: product.images || [],
          uploaded_by: null,
        });
        insertedCount++;
        console.log(`  ✓ ${insertedCount}/${jsonData.length} - ${product.name}`);
      } catch (err) {
        console.error(`  ✗ Erro ao inserir ${product.name}: ${err.message}`);
      }
    }

    console.log(`\n✓ ${insertedCount} produtos inseridos com sucesso!`);
    console.log('\n=== MIGRAÇÃO CONCLUÍDA COM SUCESSO ===');
    console.log('\nProximos passos:');
    console.log('1. Instalar dependências: npm install');
    console.log('2. Executar servidor: npm run dev');
    console.log('3. Acessar em: http://localhost:3000');
    console.log('\nAdmin padrão:');
    console.log('  Email: admin');
    console.log('  Senha: admin1234\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n✗✗✗ ERRO NA MIGRAÇÃO ===');
    console.error('Mensagem:', error.message);
    console.error(error.stack);
    if (sequelize) await sequelize.close().catch(() => {});
    if (connection) await connection.end().catch(() => {});
    process.exit(1);
  }
};

migrateDatabase();
