const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
} = require('../controllers/authController');
const { authRequired } = require('../controllers/authMiddleware');

/**
 * @route   POST /auth/register
 * @desc    Registra um novo usuário
 * @access  Public
 * @body    { email, password, confirmPassword }
 */
router.post('/register', register);

/**
 * @route   POST /auth/login
 * @desc    Faz login de um usuário (admin ou user)
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', login);

/**
 * @route   GET /auth/me
 * @desc    Retorna dados do usuário logado
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get('/me', authRequired, getMe);

module.exports = router;
