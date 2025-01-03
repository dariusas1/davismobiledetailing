import express from 'express';
import { protect } from '../middleware/auth.js';
import logger from '../config/logger.js';

const router = express.Router();

// Get system configuration
router.get('/', 
    protect,
    async (req, res) => {
        try {
            const config = {
                businessHours: {
                    start: '08:00',
                    end: '18:00'
                },
                timeZone: 'America/Los_Angeles',
                location: {
                    city: 'Santa Cruz',
                    state: 'California',
                    country: 'USA'
                },
                contact: {
                    phone: '408-634-9181',
                    email: 'contact@precisiondetailing.com'
                },
                services: [
                    'Basic Wash',
                    'Premium Detailing',
                    'Full Ceramic Coating',
                    'Interior Detailing',
                    'Exterior Detailing',
                    'Paint Correction'
                ],
                vehicleTypes: [
                    'Sedan',
                    'SUV',
                    'Truck',
                    'Van',
                    'Luxury Vehicle',
                    'Sports Car'
                ],
                slotDuration: 60, // minutes
                maxBookingsPerSlot: 1,
                advanceBookingLimit: 90, // days
                colors: {
                    primary: '#FFD700', // Gold
                    secondary: '#000000', // Black
                    accent: '#FFFFFF' // White
                }
            };

            res.json(config);
        } catch (error) {
            logger.error('Error fetching configuration:', error);
            res.status(500).json({ 
                message: 'Error fetching configuration' 
            });
        }
    }
);

// Update system configuration
router.put('/',
    protect,
    async (req, res) => {
        try {
            // In a real application, this would update configuration in a database
            // For now, we'll just acknowledge the request
            res.json({ 
                message: 'Configuration updated successfully' 
            });
        } catch (error) {
            logger.error('Error updating configuration:', error);
            res.status(500).json({ 
                message: 'Error updating configuration' 
            });
        }
    }
);

export default router;
