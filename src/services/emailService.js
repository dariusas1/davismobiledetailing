/* eslint-disable no-unused-vars */
import { Resend } from 'resend';
import Logger from '../utils/Logger';
import ErrorHandler from '../utils/ErrorHandler';

class EmailService {
    constructor() {
        // Initialize Resend with environment variable
        this.resend = new Resend(process.env.REACT_APP_RESEND_API_KEY);
    }

    // Send booking confirmation email
    async sendBookingConfirmation(bookingDetails) {
        try {
            const { 
                firstName, 
                lastName, 
                email, 
                serviceType, 
                vehicleType, 
                date, 
                time, 
                totalAmount 
            } = bookingDetails;

            const emailHtml = this.generateBookingConfirmationEmail(bookingDetails);

            const { data, error } = await this.resend.emails.send({
                from: 'Precision Detailing <bookings@precisiondetailing.com>',
                to: [email],
                subject: 'Booking Confirmation - Precision Detailing',
                html: emailHtml
            });

            if (error) {
                throw new Error(error);
            }

            // Log successful email send
            Logger.info('Booking confirmation email sent', {
                bookingId: bookingDetails.id,
                email: email
            });

            return data;
        } catch (error) {
            // Handle email sending errors
            ErrorHandler.handleError(error, {
                context: 'Booking Confirmation Email',
                bookingDetails
            });

            throw error;
        }
    }

    // Generate HTML email template
    generateBookingConfirmationEmail(bookingDetails) {
        const {
            firstName,
            lastName,
            serviceType,
            vehicleType,
            date,
            time,
            totalAmount
        } = bookingDetails;

        const serviceDetails = {
            'basic': 'Basic Wash',
            'premium': 'Premium Detail',
            'full-detail': 'Full Detailing'
        };

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #FFD700; color: #000; text-align: center; padding: 10px; }
                .content { padding: 20px; }
                .footer { background-color: #f4f4f4; text-align: center; padding: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Precision Detailing</h1>
                    <h2>Booking Confirmation</h2>
                </div>
                <div class="content">
                    <p>Hello ${firstName} ${lastName},</p>
                    <p>Thank you for booking a detailing service with Precision Detailing!</p>
                    
                    <h3>Booking Details:</h3>
                    <ul>
                        <li><strong>Service:</strong> ${serviceDetails[serviceType] || serviceType}</li>
                        <li><strong>Vehicle Type:</strong> ${vehicleType}</li>
                        <li><strong>Date:</strong> ${date}</li>
                        <li><strong>Time:</strong> ${time}</li>
                        <li><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</li>
                    </ul>

                    <p>We look forward to making your vehicle shine! If you need to modify or cancel your booking, please contact us at 408-634-9181.</p>
                    
                    <p>Best regards,<br>Precision Detailing Team</p>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} Precision Detailing. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    // Send referral invitation email
    async sendReferralInvitation(referrerName, referralEmail) {
        try {
            const emailHtml = this.generateReferralEmail(referrerName);

            const { data, error } = await this.resend.emails.send({
                from: 'Precision Detailing <referrals@precisiondetailing.com>',
                to: [referralEmail],
                subject: `${referrerName} Recommends Precision Detailing`,
                html: emailHtml
            });

            if (error) {
                throw new Error(error);
            }

            // Log successful referral email
            Logger.info('Referral invitation email sent', {
                referrerName,
                referralEmail
            });

            return data;
        } catch (error) {
            ErrorHandler.handleError(error, {
                context: 'Referral Invitation Email',
                referrerName,
                referralEmail
            });

            throw error;
        }
    }

    // Generate referral email template
    generateReferralEmail(referrerName) {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #FFD700; color: #000; text-align: center; padding: 10px; }
                .content { padding: 20px; }
                .footer { background-color: #f4f4f4; text-align: center; padding: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Precision Detailing</h1>
                    <h2>Referral Invitation</h2>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>${referrerName} recommends Precision Detailing for top-quality mobile car detailing services!</p>
                    
                    <h3>Special Referral Offer</h3>
                    <p>Use code REFERRED20 for 20% off your first detailing service.</p>

                    <p>Book now and experience professional mobile detailing that comes to you!</p>
                    
                    <p>Best regards,<br>Precision Detailing Team</p>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} Precision Detailing. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}

export default new EmailService();
