// const router = require('express').Router();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const authenticate = require('../middleware/auth');

// router.use(authenticate);

// // Get all leads by org
// router.get('/', async (req, res) => {
//   const leads = await prisma.lead.findMany({
//     where: { organizationId: req.user.organizationId },
//     orderBy: { createdAt: 'desc' }
//   });
//   res.json(leads);
// });

// // Create a lead
// router.post('/', async (req, res) => {
//   const { name, email, phone, source, status } = req.body;
//   const lead = await prisma.lead.create({
//     data: {
//       name, email, phone, source, status,
//       organizationId: req.user.organizationId
//     }
//   });
//   res.status(201).json(lead);
// });

// // Update a lead
// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const lead = await prisma.lead.update({
//     where: { id },
//     data: req.body
//   });
//   res.json(lead);
// });

// // Delete a lead
// router.delete('/:id', async (req, res) => {
//   await prisma.lead.delete({ where: { id: req.params.id } });
//   res.status(204).end();
// });

// module.exports = router;

const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticate = require('../middleware/auth');

router.use(authenticate);

// Get all leads by org
router.get('/', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      where: { organizationId: req.user.organizationId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

// Create a lead
router.post('/', async (req, res) => {
  const { name, email, phone = "", source = "", status = "New" } = req.body;

  try {
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        source,
        status,
        organizationId: req.user.organizationId
      }
    });
    res.status(201).json(lead);
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

// Update a lead
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone = "", source = "", status } = req.body;

  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: { name, email, phone, source, status }
    });
    res.json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ error: "Failed to update lead" });
  }
});

// Delete a lead
router.delete('/:id', async (req, res) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

module.exports = router;
