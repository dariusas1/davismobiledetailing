import validator from 'validator';

// Validation utility for authentication and user inputs
export const validateInput = {
    // Email validation
    email: (email) => {
        if (!email) {
            return { 
                isValid: false, 
                error: 'Email is required' 
            };
        }
        
        if (!validator.isEmail(email)) {
            return { 
                isValid: false, 
                error: 'Invalid email format' 
            };
        }
        
        return { 
            isValid: true 
        };
    },

    // Password validation
    password: (password) => {
        if (!password) {
            return { 
                isValid: false, 
                error: 'Password is required' 
            };
        }
        
        // At least 8 characters, one uppercase, one lowercase, one number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        
        if (!passwordRegex.test(password)) {
            return { 
                isValid: false, 
                error: 'Password must be at least 8 characters, include uppercase, lowercase, and number' 
            };
        }
        
        return { 
            isValid: true 
        };
    },

    // Name validation
    name: (name) => {
        if (!name) {
            return { 
                isValid: false, 
                error: 'Name is required' 
            };
        }
        
        // Allow letters, spaces, and hyphens
        const nameRegex = /^[a-zA-Z\s-]+$/;
        
        if (!nameRegex.test(name)) {
            return { 
                isValid: false, 
                error: 'Name can only contain letters, spaces, and hyphens' 
            };
        }
        
        if (name.length < 2) {
            return { 
                isValid: false, 
                error: 'Name must be at least 2 characters long' 
            };
        }
        
        return { 
            isValid: true 
        };
    },

    // Phone number validation
    phone: (phone) => {
        if (!phone) {
            return { 
                isValid: false, 
                error: 'Phone number is required' 
            };
        }
        
        // US phone number validation
        const phoneRegex = /^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
        
        if (!phoneRegex.test(phone)) {
            return { 
                isValid: false, 
                error: 'Invalid phone number format' 
            };
        }
        
        return { 
            isValid: true 
        };
    },

    // Validate registration form
    validateRegistration: (userData) => {
        const validations = [
            validateInput.email(userData.email),
            validateInput.password(userData.password),
            validateInput.name(userData.firstName),
            validateInput.name(userData.lastName),
            userData.phone ? validateInput.phone(userData.phone) : { isValid: true }
        ];

        const errors = validations
            .filter(validation => !validation.isValid)
            .map(validation => validation.error);

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    // Validate login form
    validateLogin: (loginData) => {
        const validations = [
            validateInput.email(loginData.email),
            validateInput.password(loginData.password)
        ];

        const errors = validations
            .filter(validation => !validation.isValid)
            .map(validation => validation.error);

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};
