const express = require('express');
const path = require('path');
const multer = require('multer');

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Middleware para ler JSON no body das requisições (POST)
app.use(express.json());

// Serve arquivos estáticos da pasta /public (index.html, imagens, CSS)
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da API
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Middleware de upload exportado para uso nas rotas
app.locals.upload = upload;

module.exports = app;
 