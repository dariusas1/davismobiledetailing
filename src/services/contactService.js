import axios from 'axios';
import Logger from '../utils/Logger';

class ContactService {
    static async submitContactForm(formData) {
        try {
            const response = await axios.post('/api/contact', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Log successful contact form submission
            Logger.info('Contact form submitted', {
                email: formData.email,
                serviceType: formData.serviceType
            });

            return response.data;
        } catch (error) {
            // Log error details
            Logger.error('Contact form submission failed', {
                error: error.message,
                email: formData.email,
                serviceType: formData.serviceType
            });

            // Throw a user-friendly error
            throw new Error(
                error.response?.data?.message || 
                'Unable to submit contact form. Please try again later.'
            );
        }
    }

    // Optional: Validate contact form data client-side
    static validateContactForm(formData) {
        const errors = {};

        // Name validation
        if (!formData.name || formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters long';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Phone validation 
        const phoneRegex = /^\+?1?\d{10,14}$/;
        if (!formData.phone || !phoneRegex.test(formData.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }

        // Service type validation
        const validServiceTypes = [
            'Basic Wash',
            'Premium Detailing', 
            'Full Ceramic Coating', 
            'Interior Detailing', 
            'Exterior Detailing', 
            'Paint Correction'
        ];
        if (!formData.serviceType || !validServiceTypes.includes(formData.serviceType)) {
            errors.serviceType = 'Please select a valid service type';
        }

        // Message validation
        if (!formData.message || formData.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters long';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

export default ContactService;
