const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/authMiddleware');

// Get User Preferences
router.get('/preferences', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            preferences: {
                servicePreferences: user.preferences.preferredServices,
                timeSlotPreferences: user.preferences.preferredTimeSlots,
                vehicleTypes: user.preferences.vehicleTypes,
                communicationChannels: user.preferences.communicationChannels
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving user preferences', 
            error: error.message 
        });
    }
});

// Update User Preferences
router.put('/preferences', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { 
            servicePreferences, 
            timeSlotPreferences, 
            vehicleTypes, 
            communicationChannels 
        } = req.body;

        // Validate and update preferences
        if (servicePreferences) {
            user.preferences.preferredServices = servicePreferences;
        }

        if (timeSlotPreferences) {
            user.preferences.preferredTimeSlots = timeSlotPreferences;
        }

        if (vehicleTypes) {
            user.preferences.vehicleTypes = vehicleTypes;
        }

        if (communicationChannels) {
            user.preferences.communicationChannels = communicationChannels;
        }

        await user.save();

        res.json({
            message: 'Preferences updated successfully',
            preferences: {
                servicePreferences: user.preferences.preferredServices,
                timeSlotPreferences: user.preferences.preferredTimeSlots,
                vehicleTypes: user.preferences.vehicleTypes,
                communicationChannels: user.preferences.communicationChannels
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating user preferences', 
            error: error.message 
        });
    }
});

// Get Recommended Services Based on Preferences
router.get('/recommended-services', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch recommended services based on user preferences
        const recommendedServices = await Service.find({
            $or: [
                { type: { $in: user.preferences.preferredServices } },
                { vehicleType: { $in: user.preferences.vehicleTypes } }
            ]
        }).limit(5);

        res.json({
            recommendedServices,
            userPreferences: {
                servicePreferences: user.preferences.preferredServices,
                vehicleTypes: user.preferences.vehicleTypes
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving recommended services', 
            error: error.message 
        });
    }
});

module.exports = router;
