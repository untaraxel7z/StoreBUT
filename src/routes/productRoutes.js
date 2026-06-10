const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getAllProducts,
  getProductById,
  createProduct,
  createProductWithUpload,
  deleteProduct,
} = require('../controllers/productController');

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/images'));
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

/**
 * @route   GET /products
 * @desc    Lista todos os tênis (feed/vitrine)
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   GET /products/:id
 * @desc    Busca um tênis específico pelo ID (página de detalhes)
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   POST /products
 * @desc    Cadastra um novo tênis (área do administrador)
 * @access  Admin
 * @body    { name, style, price, description, sku, status, images[] }
 */
router.post('/', createProduct);

/**
 * @route   POST /products/upload
 * @desc    Cadastra um novo tênis com upload de imagem
 * @access  Admin
 * @body    { name, style, price, description, sku, file }
 */
router.post('/upload', upload.single('image'), createProductWithUpload);

/**
 * @route   DELETE /products/:id
 * @desc    Remove um tênis do catálogo
 * @access  Admin
 */
router.delete('/:id', deleteProduct);

module.exports = router;