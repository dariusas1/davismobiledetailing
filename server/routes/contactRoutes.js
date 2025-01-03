import express from 'express';
import logger from '../config/logger.js';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();

// Validation middleware for contact form
router.post('/contact', async (req, res) => {
    logger.info('Incoming Request', { body: req.body });

    const { name, email, phone, serviceType, message } = req.body;
    
    if (!name) {
        logger.error('Customer name is required.');
        return res.status(400).send('Customer name is required.');
    }

   // Check for all required fields
   if (!email || !phone || !serviceType || !message) {
        logger.error('Email, phone, service type, and message are required.');
        return res.status(400).send('All fields are required.');
    }

    // Prepare email data using template system
    const emailData = {
        from: 'contact@precisiondetailing.com',
        to: '408-634-9181@telnyx.com',
        subject: 'New Contact Form Submission - ' + serviceType,
        template: 'contactForm',
        data: {
            name: name,
            email: email,
            phone: phone,
            serviceType: serviceType,
            message: message
        }
    };

    try {
        await sendEmail(emailData);
        // Send confirmation email to customer using template system
        const confirmationEmailData = {
            from: 'contact@precisiondetailing.com',
            to: email,
            subject: 'Thank You for Contacting Precision Detailing',
            template: 'contactConfirmation',
            data: {
                name: name,
                serviceType: serviceType
            }
        };

        await sendEmail(confirmationEmailData);
        logger.info('Contact form submitted successfully', { email: email, serviceType: serviceType });
        res.status(200).json({ message: 'Contact form submitted successfully' });
    } catch (error) {
        // Log and handle any email sending or processing errors
        logger.error('Contact form submission failed', { 
            error: error.message,
            submittedData: req.body 
        });

        res.status(500).json({ 
            message: 'Unable to process contact form. Please try again later.' 
        });
    }
});

export default router;
