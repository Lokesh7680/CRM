const express = require("express");
const { getInvoices, createInvoice, downloadInvoice } = require("./invoice.controller");
const { authenticate } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getInvoices);
router.post("/", authenticate, createInvoice);
router.get("/:id/pdf", authenticate, downloadInvoice);

module.exports = router;
