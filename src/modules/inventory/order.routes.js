const express = require("express");
const { getOrders, createOrder } = require("./order.controller");
const { authenticate } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getOrders);
router.post("/", authenticate, createOrder);

module.exports = router;
