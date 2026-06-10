const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    comment: 'ID do usuário admin que subiu o produto (NULL = produto original)',
  },
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
});

module.exports = Product;

