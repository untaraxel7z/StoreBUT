const Product = require('./ProductSequelize');

/**
 * Retorna todos os produtos.
 * @returns {Promise<Array>}
 */
const findAll = async () => {
  try {
    return await Product.findAll({
      raw: true,
      order: [['id', 'ASC']],
    });
  } catch (error) {
    throw new Error(`Erro ao buscar produtos: ${error.message}`);
  }
};

/**
 * Busca um produto pelo ID.
 * @param {number|string} id
 * @returns {Promise<Object|null>} Produto encontrado ou null.
 */
const findById = async (id) => {
  try {
    const product = await Product.findByPk(id);
    return product ? product.get({ plain: true }) : null;
  } catch (error) {
    throw new Error(`Erro ao buscar produto: ${error.message}`);
  }
};

/**
 * Cria um novo produto no banco.
 * @param {Object} productData - Dados do novo produto.
 * @returns {Promise<Object>} Produto criado.
 */
const create = async (productData) => {
  try {
    const newProduct = await Product.create({
      name: productData.name,
      style: productData.style,
      price: parseFloat(productData.price),
      description: productData.description,
      sku: productData.sku,
      status: productData.status || 'disponivel',
      images: productData.images || [],
    });

    return newProduct.get({ plain: true });
  } catch (error) {
    throw new Error(`Erro ao criar produto: ${error.message}`);
  }
};

module.exports = {
  findAll,
  findById,
  create,
};