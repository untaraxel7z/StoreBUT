const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_key_super_seguro_aqui';

// Admin fixo (hardcoded)
const ADMIN_CREDENTIALS = {
  email: 'admin',
  password: 'admin1234',
};

/**
 * Gera um JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { algorithm: 'HS256' }
  );
};

/**
 * POST /auth/register
 * Registra um novo usuário comum
 */
const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validações
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, senha e confirmação são obrigatórios.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'As senhas não correspondem.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Senha deve ter no mínimo 6 caracteres.',
      });
    }

    // Validar email simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido.',
      });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está registrado.',
      });
    }

    // Hash da senha
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Criar usuário
    const newUser = await User.create({
      email,
      password_hash: passwordHash,
      role: 'user',
    });

    // Gerar token
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso!',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Erro ao registrar:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário.',
    });
  }
};

/**
 * POST /auth/login
 * Faz login de um usuário (admin fixo ou usuário comum)
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios.',
      });
    }

    // Verificar admin fixo
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const token = jwt.sign(
        {
          id: 0,
          email: 'admin',
          role: 'admin',
        },
        JWT_SECRET,
        { algorithm: 'HS256' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login admin realizado com sucesso!',
        token,
        user: {
          id: 0,
          email: 'admin',
          role: 'admin',
        },
      });
    }

    // Procurar usuário no banco
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos.',
      });
    }

    // Comparar senha
    const bcrypt = require('bcryptjs');
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos.',
      });
    }

    // Gerar token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erro ao fazer login.',
    });
  }
};

/**
 * GET /auth/me
 * Retorna dados do usuário logado (requer token)
 */
const getMe = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do usuário.',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  generateToken,
  JWT_SECRET,
};
