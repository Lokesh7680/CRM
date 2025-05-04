const { fetchProducts, addProduct } = require("./product.service");

const getProducts = async (req, res) => {
  try {
    const data = await fetchProducts(req.user.organizationId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await addProduct(req.user.organizationId, req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getProducts, createProduct };
