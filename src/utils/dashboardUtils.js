import { toast } from 'react-toastify';

// Utility for data validation
export const validateDashboardInput = (data, rules) => {
    const errors = {};

    Object.keys(rules).forEach(field => {
        const value = data[field];
        const fieldRules = rules[field];

        // Required check
        if (fieldRules.required && !value) {
            errors[field] = `${field} is required`;
        }

        // Minimum length check
        if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
            errors[field] = `${field} must be at least ${fieldRules.minLength} characters`;
        }

        // Maximum length check
        if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
            errors[field] = `${field} must be no more than ${fieldRules.maxLength} characters`;
        }

        // Regex pattern check
        if (fieldRules.pattern && value && !fieldRules.pattern.test(value)) {
            errors[field] = `${field} is invalid`;
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Utility for form state management
export const createFormState = (initialState) => {
    const [formData, setFormData] = React.useState(initialState);
    const [errors, setErrors] = React.useState({});

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const validateForm = (validationRules) => {
        const validationResult = validateDashboardInput(formData, validationRules);
        setErrors(validationResult.errors);
        return validationResult.isValid;
    };

    const resetForm = () => {
        setFormData(initialState);
        setErrors({});
    };

    return {
        formData,
        errors,
        handleChange,
        validateForm,
        resetForm,
        setFormData
    };
};

// Utility for performance tracking
export const trackDashboardPerformance = (functionName) => {
    return async (fn) => {
        const start = performance.now();
        try {
            const result = await fn();
            const end = performance.now();
            
            // Log performance metrics
            console.log(`${functionName} performance:`, {
                executionTime: end - start,
                timestamp: new Date().toISOString()
            });

            return result;
        } catch (error) {
            console.error(`Error in ${functionName}:`, error);
            toast.error(`Operation ${functionName} failed`);
            throw error;
        }
    };
};

// Utility for data transformation
export const transformDashboardData = {
    // Convert date formats
    formatDate: (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Truncate long text
    truncateText: (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength 
            ? `${text.substring(0, maxLength)}...` 
            : text;
    },

    // Generate color based on data
    generateColorFromData: (data) => {
        let hash = 0;
        const str = JSON.stringify(data);
        
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash; // Convert to 32-bit integer
        }

        const r = (hash & 0xFF0000) >> 16;
        const g = (hash & 0x00FF00) >> 8;
        const b = hash & 0x0000FF;

        return `rgb(${r},${g},${b})`;
    }
};

// Utility for caching dashboard data
export const createDashboardCache = () => {
    const cache = new Map();

    return {
        set: (key, value, ttl = 5 * 60 * 1000) => { // Default 5 minutes
            const item = {
                value,
                expiry: Date.now() + ttl
            };
            cache.set(key, item);
        },
        get: (key) => {
            const item = cache.get(key);
            if (!item) return null;
            
            if (Date.now() > item.expiry) {
                cache.delete(key);
                return null;
            }

            return item.value;
        },
        clear: (key) => {
            if (key) {
                cache.delete(key);
            } else {
                cache.clear();
            }
        }
    };
};
