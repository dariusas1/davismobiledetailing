const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { cacheResponse } = require('../middleware/cache');

// Public routes
router.get('/', cacheResponse(300), serviceController.getAllServices);
router.get('/recommendations', serviceController.getRecommendations);
router.get('/:id', cacheResponse(300), serviceController.getServiceById);

// Protected routes (admin only)
router.post('/',
    authenticate,
    authorize(['admin']),
    validateRequest('service'),
    serviceController.createService
);

router.put('/:id',
    authenticate,
    authorize(['admin']),
    validateRequest('service'),
    serviceController.updateService
);

router.delete('/:id',
    authenticate,
    authorize(['admin']),
    serviceController.deleteService
);

module.exports = router; 