require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const contactRoutes = require("./modules/contacts/contact.routes");
const leadRoutes = require("./modules/leads/lead.routes");
const opportunityRoutes = require("./modules/opportunities/opportunity.routes");
const campaignRoutes = require("./modules/campaigns/campaign.routes");
const taskRoutes = require("./modules/tasks/task.routes");
const noteRoutes = require("./modules/notes/note.routes");
const productRoutes = require("./modules/inventory/product.routes");
const supplierRoutes = require("./modules/inventory/supplier.routes");
const orderRoutes = require("./modules/inventory/order.routes");
const invoiceRoutes = require("./modules/invoicing/invoice.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/invoices", invoiceRoutes);

app.get("/", (req, res) => {
  res.send("CRM Backend is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
