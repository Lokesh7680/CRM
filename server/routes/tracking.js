// File: server/routes/tracking.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL connection
const path = require('path');

// 1x1 transparent pixel
const pixelBuffer = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  'base64'
);

// Track opens
router.get('/track/open/:campaignId', async (req, res) => {
  const { campaignId } = req.params;
  const email = req.query.email;
  try {
    await pool.query(
      'INSERT INTO email_logs (campaign_id, email, event_type, timestamp) VALUES ($1, $2, $3, NOW())',
      [campaignId, email, 'open']
    );
  } catch (err) {
    console.error('Error logging open:', err);
  }
  res.set('Content-Type', 'image/gif');
  res.send(pixelBuffer);
});

// Track clicks
router.get('/track/click/:campaignId', async (req, res) => {
  const { campaignId } = req.params;
  const { email, redirect } = req.query;
  try {
    await pool.query(
      'INSERT INTO email_logs (campaign_id, email, event_type, timestamp) VALUES ($1, $2, $3, NOW())',
      [campaignId, email, 'click']
    );
  } catch (err) {
    console.error('Error logging click:', err);
  }
  res.redirect(redirect || 'https://www.google.com/');
});

module.exports = router;
