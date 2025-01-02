const { Resend } = require('resend');
const { logger } = require('../utils/logger');

async function sendEmail(options) {
    const resend = new Resend(process.env.REACT_APP_RESEND_API_KEY);

    try {
        const { to, subject, template, data } = options;

        // Basic email templates
        const emailTemplates = {
            bookingConfirmation: `
                <html>
                    <body>
                        <h1>Booking Confirmation - Precision Detailing</h1>
                        <p>Dear ${data.customerName},</p>
                        <p>Your booking for ${data.serviceType} has been confirmed.</p>
                        <h2>Booking Details:</h2>
                        <ul>
                            <li><strong>Date:</strong> ${data.bookingDate}</li>
                            <li><strong>Total Price:</strong> $${data.totalPrice}</li>
                        </ul>
                        <p>We look forward to serving you!</p>
                        <p>Best regards,<br>Precision Detailing Team</p>
                    </body>
                </html>
            `,
            bookingCancellation: `
                <html>
                    <body>
                        <h1>Booking Cancellation - Precision Detailing</h1>
                        <p>Dear ${data.customerName},</p>
                        <p>Your booking for ${data.serviceType} has been cancelled.</p>
                        <p>If this was not your intention, please contact us.</p>
                        <p>Best regards,<br>Precision Detailing Team</p>
                    </body>
                </html>
            `,
            contactForm: `
                <html>
                    <body style="background-color: #f8f9fa; padding: 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <h1 style="color: #d4af37; text-align: center;">New Contact Form Submission</h1>
                            <div style="margin-top: 20px;">
                                <p><strong>Name:</strong> ${data.name}</p>
                                <p><strong>Email:</strong> ${data.email}</p>
                                <p><strong>Phone:</strong> ${data.phone}</p>
                                <p><strong>Service Type:</strong> ${data.serviceType}</p>
                                <p><strong>Message:</strong></p>
                                <p style="background-color: #f8f9fa; padding: 10px; border-radius: 4px;">${data.message}</p>
                            </div>
                        </div>
                    </body>
                </html>
            `,
            contactConfirmation: `
                <html>
                    <body style="background-color: #f8f9fa; padding: 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <h1 style="color: #d4af37; text-align: center;">Thank You for Contacting Precision Detailing</h1>
                            <div style="margin-top: 20px;">
                                <p>Dear ${data.name},</p>
                                <p>We have received your inquiry about our ${data.serviceType} service. Our team will review your message and get back to you soon.</p>
                                <p>If you have any urgent questions, feel free to call us at <strong>408-634-9181</strong>.</p>
                                <p style="margin-top: 30px;">Best regards,</p>
                                <p style="color: #d4af37; font-weight: bold;">Precision Detailing Team</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
        };

        const emailContent = emailTemplates[template] || 'No template found';

        const emailResult = await resend.emails.send({
            from: 'Precision Detailing <contact@precision-detail.com>',
            to: to,
            subject: subject,
            html: emailContent
        });

        if (emailResult.error) {
            logger.error('Email delivery failed', {
                recipient: to,
                subject: subject,
                error: emailResult.error.message
            });
            throw new Error(`Email delivery failed: ${emailResult.error.message}`);
        }

        logger.info('Email delivered successfully', {
            recipient: to,
            subject: subject,
            messageId: emailResult.data.id
        });

        return emailResult.data;
    } catch (error) {
        logger.error('Email sending error', { 
            error: error.message,
            details: options
        });
        throw error;
    }
}

module.exports = { sendEmail };
