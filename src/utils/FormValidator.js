class FormValidator {
    constructor(validationRules) {
        this.validationRules = validationRules;
        this.errors = {};
    }

    // Validate entire form
    validate(formData) {
        this.errors = {};

        Object.keys(this.validationRules).forEach(field => {
            const rules = this.validationRules[field];
            const value = formData[field];

            // Required validation
            if (rules.required && !this.isFieldFilled(value)) {
                this.errors[field] = `${field} is required`;
                return;
            }

            // Type-specific validations
            if (value) {
                if (rules.type === 'email' && !this.isValidEmail(value)) {
                    this.errors[field] = 'Invalid email format';
                }

                if (rules.type === 'phone' && !this.isValidPhone(value)) {
                    this.errors[field] = 'Invalid phone number';
                }

                if (rules.minLength && value.length < rules.minLength) {
                    this.errors[field] = `Minimum length is ${rules.minLength} characters`;
                }

                if (rules.maxLength && value.length > rules.maxLength) {
                    this.errors[field] = `Maximum length is ${rules.maxLength} characters`;
                }

                if (rules.pattern && !rules.pattern.test(value)) {
                    this.errors[field] = `Invalid ${field} format`;
                }

                // Custom validation function
                if (rules.custom && typeof rules.custom === 'function') {
                    const customValidationResult = rules.custom(value, formData);
                    if (customValidationResult !== true) {
                        this.errors[field] = customValidationResult;
                    }
                }
            }
        });

        return {
            isValid: Object.keys(this.errors).length === 0,
            errors: this.errors
        };
    }

    // Helper validation methods
    isFieldFilled(value) {
        return value !== undefined && value !== null && value.toString().trim() !== '';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^(\+1\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;
        return phoneRegex.test(phone);
    }

    // Static method for quick validation
    static validate(formData, validationRules) {
        const validator = new FormValidator(validationRules);
        return validator.validate(formData);
    }
}

export default FormValidator;
