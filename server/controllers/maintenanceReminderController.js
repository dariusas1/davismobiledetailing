import MaintenanceReminder from '../models/MaintenanceReminder.js';
import { sendEmail } from '../utils/email.js';
import logger from '../config/logger.js';

// Create new maintenance reminder
export const createReminder = async (req, res) => {
    try {
        const {
            vehicle,
            type,
            frequency,
            priority,
            notificationSettings,
            customInstructions
        } = req.body;

        const reminder = new MaintenanceReminder({
            vehicle,
            user: req.user.id,
            type,
            frequency,
            priority,
            notificationSettings,
            customInstructions
        });

        await reminder.calculateNextDueDate();
        await reminder.save();

        res.status(201).json({
            success: true,
            data: reminder
        });
    } catch (error) {
        logger.error('Error creating maintenance reminder:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating maintenance reminder'
        });
    }
};

// Get user's maintenance reminders
export const getUserReminders = async (req, res) => {
    try {
        const { status, type, page = 1, limit = 10 } = req.query;
        const query = {
            user: req.user.id,
            isActive: true
        };

        if (status) query.status = status;
        if (type) query.type = type;

        const reminders = await MaintenanceReminder.find(query)
            .populate('vehicle', 'make model year')
            .sort({ nextDueDate: 1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await MaintenanceReminder.countDocuments(query);

        res.status(200).json({
            success: true,
            data: reminders,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        logger.error('Error getting user reminders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching maintenance reminders'
        });
    }
};

// Update reminder
export const updateReminder = async (req, res) => {
    try {
        const {
            frequency,
            priority,
            notificationSettings,
            customInstructions
        } = req.body;

        const reminder = await MaintenanceReminder.findOne({
            _id: req.params.id,
            user: req.user.id,
            isActive: true
        });

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: 'Maintenance reminder not found'
            });
        }

        if (frequency) reminder.frequency = frequency;
        if (priority) reminder.priority = priority;
        if (notificationSettings) {
            reminder.notificationSettings = {
                ...reminder.notificationSettings,
                ...notificationSettings
            };
        }
        if (customInstructions) reminder.customInstructions = customInstructions;

        await reminder.calculateNextDueDate();
        await reminder.save();

        res.status(200).json({
            success: true,
            data: reminder
        });
    } catch (error) {
        logger.error('Error updating maintenance reminder:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating maintenance reminder'
        });
    }
};

// Complete maintenance service
export const completeService = async (req, res) => {
    try {
        const { date, mileage, notes, serviceId } = req.body;

        const reminder = await MaintenanceReminder.findOne({
            _id: req.params.id,
            user: req.user.id,
            isActive: true
        });

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: 'Maintenance reminder not found'
            });
        }

        await reminder.completeService({
            date,
            mileage,
            notes,
            serviceId,
            performedBy: req.user.id
        });

        res.status(200).json({
            success: true,
            data: reminder
        });
    } catch (error) {
        logger.error('Error completing maintenance service:', error);
        res.status(500).json({
            success: false,
            message: 'Error completing maintenance service'
        });
    }
};

// Delete reminder
export const deleteReminder = async (req, res) => {
    try {
        const reminder = await MaintenanceReminder.findOne({
            _id: req.params.id,
            user: req.user.id,
            isActive: true
        });

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: 'Maintenance reminder not found'
            });
        }

        reminder.isActive = false;
        await reminder.save();

        res.status(200).json({
            success: true,
            message: 'Maintenance reminder deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting maintenance reminder:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting maintenance reminder'
        });
    }
};

// Process due reminders and send notifications
export const processDueReminders = async () => {
    try {
        const reminders = await MaintenanceReminder.find({
            isActive: true,
            'notificationSettings.enabled': true
        }).populate('user vehicle');

        for (const reminder of reminders) {
            await reminder.updateStatus();

            if (reminder.shouldNotify()) {
                const notificationsSent = [];

                // Send email notification
                if (reminder.notificationSettings.channels.includes('email')) {
                    await sendEmail({
                        to: reminder.user.email,
                        subject: `Maintenance Reminder: ${reminder.type} Service Due`,
                        template: 'maintenanceReminder',
                        data: {
                            userName: reminder.user.name,
                            vehicleName: `${reminder.vehicle.year} ${reminder.vehicle.make} ${reminder.vehicle.model}`,
                            serviceType: reminder.type,
                            dueDate: reminder.nextDueDate,
                            instructions: reminder.customInstructions
                        }
                    });
                    notificationsSent.push('email');
                }

                // Record notification in history
                reminder.history.push({
                    date: new Date(),
                    action: 'notification_sent',
                    notes: `Notifications sent via: ${notificationsSent.join(', ')}`
                });

                await reminder.save();
            }
        }

        logger.info('Maintenance reminders processed successfully');
    } catch (error) {
        logger.error('Error processing maintenance reminders:', error);
        throw error;
    }
}; 