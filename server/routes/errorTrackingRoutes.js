/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const errorTrackingService = require('../services/errorTrackingService');

// Log error from frontend
router.post('/log', async (req, res) => {
  try {
    const { error, componentStack, timestamp, context } = req.body;

    const errorId = await errorTrackingService.logError(
      new Error(error),
      {},
      {
        level: 'error',
        context: {
          ...context,
          source: 'frontend'
        }
      }
    );

    res.status(200).json({ errorId });
  } catch (err) {
    console.error('Failed to log frontend error:', err);
    res.status(500).json({ message: 'Failed to log error' });
  }
});

module.exports = router;
