require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const contactRoutes = require("./modules/contacts/contact.routes");
const leadRoutes = require("./modules/leads/lead.routes");
const opportunityRoutes = require("./modules/opportunities/opportunity.routes");
const campaignRoutes = require("./modules/campaigns/campaign.routes");
const campaignTemplatesRoute = require("./modules/campaignTemplates/campaignTemplates.routes");
const campaignQueueRoutes = require("./modules/campaigns/campaign.queue.routes");
const analyticsRoutes = require("../routes/analytics.js");
const emailRoutes = require("./modules/email/email.routes");
const taskRoutes = require("./modules/tasks/task.routes");
const noteRoutes = require("./modules/notes/note.routes");
const productRoutes = require("./modules/inventory/product.routes");
const supplierRoutes = require("./modules/inventory/supplier.routes");
const orderRoutes = require("./modules/inventory/order.routes");
// const invoiceRoutes = require("./modules/invoicing/invoice.routes");
const invoiceRoutes = require("../routes/invoiceRoutes");
const templateRoutes = require("../routes/templates");
const templateAnalyticsRoutes = require("../routes/templateAnalytics.routes");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Start Task Reminder Cron
require("./jobs/taskReminderCron");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/templates", campaignTemplatesRoute);
app.use("/api/campaigns/queue", campaignQueueRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api", emailRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/templates", templateRoutes); // ✅ ensure this matches the frontend path
app.use("/api/analytics", templateAnalyticsRoutes);


app.get("/", (req, res) => {
  res.send("CRM Backend is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
