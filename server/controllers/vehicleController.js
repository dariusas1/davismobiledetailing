import { Vehicle } from '../models/index.js';
import logger from '../config/logger.js';
import { validateVehicle } from '../utils/validation.js';

// Get all vehicles for a user
export const getUserVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ user: req.user.id, isActive: true });
        res.status(200).json({
            success: true,
            data: vehicles
        });
    } catch (error) {
        logger.error('Error getting user vehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vehicles'
        });
    }
};

// Get vehicle by ID
export const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        res.status(200).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        logger.error('Error getting vehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vehicle'
        });
    }
};

// Add new vehicle
export const addVehicle = async (req, res) => {
    try {
        const { error } = validateVehicle(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const vehicle = new Vehicle({
            ...req.body,
            user: req.user.id
        });

        await vehicle.save();

        res.status(201).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        logger.error('Error adding vehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding vehicle'
        });
    }
};

// Update vehicle
export const updateVehicle = async (req, res) => {
    try {
        const { error } = validateVehicle(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        res.status(200).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        logger.error('Error updating vehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating vehicle'
        });
    }
};

// Delete vehicle (soft delete)
export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { isActive: false },
            { new: true }
        );

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vehicle deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting vehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting vehicle'
        });
    }
};

// Add service history
export const addServiceHistory = async (req, res) => {
    try {
        const { service, notes, mileage } = req.body;

        const vehicle = await Vehicle.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        vehicle.serviceHistory.push({
            service,
            notes,
            mileage,
            date: new Date()
        });

        await vehicle.save();

        res.status(200).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        logger.error('Error adding service history:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding service history'
        });
    }
};

// Get service history
export const getServiceHistory = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate('serviceHistory.service', 'name description');

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        res.status(200).json({
            success: true,
            data: vehicle.serviceHistory
        });
    } catch (error) {
        logger.error('Error getting service history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching service history'
        });
    }
}; 