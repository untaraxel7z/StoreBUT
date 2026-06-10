const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_key_super_seguro_aqui';

/**
 * Middleware para verificar autenticação
 * Extrai o token do header Authorization e valida
 */
const authRequired = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido.',
      });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado.',
    });
  }
};

/**
 * Middleware para verificar se o usuário é admin
 * Deve ser usado APÓS authRequired
 */
const adminRequired = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Privilégios de administrador necessários.',
    });
  }
  next();
};

module.exports = {
  authRequired,
  adminRequired,
  JWT_SECRET,
};
