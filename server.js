const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const leadRoutes = require('./routes/lead');
const contactsRoute = require("./routes/contacts");
const opportunityRoutes = require("./routes/opportunities");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/leads', leadRoutes);
app.use("/contacts", authenticateToken, contactsRoute);
app.use("/opportunities", authenticateToken, opportunityRoutes);
app.use("/api/campaigns", campaignRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
