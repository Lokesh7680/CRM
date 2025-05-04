const { fetchOrders, addOrder } = require("./order.service");

const getOrders = async (req, res) => {
  try {
    const orders = await fetchOrders(req.user.organizationId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await addOrder(req.user.organizationId, req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getOrders, createOrder };
