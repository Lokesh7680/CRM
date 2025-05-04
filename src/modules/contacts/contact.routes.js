const express = require("express");
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact
} = require("./contact.controller");
const { authenticate } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getContacts);
router.post("/", authenticate, createContact);
router.put("/:id", authenticate, updateContact);
router.delete("/:id", authenticate, deleteContact);

module.exports = router;
