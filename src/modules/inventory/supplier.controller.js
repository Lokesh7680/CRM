const { fetchSuppliers, addSupplier } = require("./supplier.service");

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await fetchSuppliers(req.user.organizationId);
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const supplier = await addSupplier(req.user.organizationId, req.body);
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getSuppliers, createSupplier };
