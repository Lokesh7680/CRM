const express = require("express");
const { getProducts, createProduct } = require("./product.controller");
const { authenticate } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getProducts);
router.post("/", authenticate, createProduct);

module.exports = router;
