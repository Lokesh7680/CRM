const express = require("express");
const { getSuppliers, createSupplier } = require("./supplier.controller");
const { authenticate } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getSuppliers);
router.post("/", authenticate, createSupplier);

module.exports = router;
