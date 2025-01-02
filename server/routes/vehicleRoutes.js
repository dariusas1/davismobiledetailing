import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getUserVehicles,
    getVehicleById,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addServiceHistory,
    getServiceHistory
} from '../controllers/vehicleController.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Vehicle routes
router.get('/', getUserVehicles);
router.get('/:id', getVehicleById);
router.post('/', addVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

// Service history routes
router.post('/:id/service-history', addServiceHistory);
router.get('/:id/service-history', getServiceHistory);

export default router; 