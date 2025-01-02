export const errorMessages = {
    booking: {
        invalidName: 'Please enter a valid name with at least 2 characters',
        invalidEmail: 'Please enter a valid email address',
        invalidPhone: 'Phone number must be 10 digits long',
        invalidServiceType: 'Please select a valid service type',
        invalidVehicleType: 'Please select a valid vehicle type',
        invalidBookingDate: 'Booking date must be at least 24 hours in the future',
        invalidBookingTime: 'Please select a valid booking time',
        locationRequired: 'Service location is required',
        bookingCreationFailed: 'Unable to create booking. Please try again or contact support.'
    },
    general: {
        networkError: 'Network error. Please check your connection.',
        serverError: 'Server error. Please try again later.',
        unknownError: 'An unexpected error occurred.'
    }
};

export const validateBookingForm = (formData) => {
    const errors = {};

    // Name validation
    if (!formData.name || formData.name.length < 2) {
        errors.name = errorMessages.booking.invalidName;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = errorMessages.booking.invalidEmail;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
        errors.phone = errorMessages.booking.invalidPhone;
    }

    // Service type validation
    if (!formData.serviceType) {
        errors.serviceType = errorMessages.booking.invalidServiceType;
    }

    // Vehicle type validation
    if (!formData.vehicleType) {
        errors.vehicleType = errorMessages.booking.invalidVehicleType;
    }

    // Booking date validation
    const minBookingDate = new Date();
    minBookingDate.setDate(minBookingDate.getDate() + 1);
    if (!formData.bookingDate || formData.bookingDate < minBookingDate) {
        errors.bookingDate = errorMessages.booking.invalidBookingDate;
    }

    // Booking time validation
    if (!formData.bookingTime) {
        errors.bookingTime = errorMessages.booking.invalidBookingTime;
    }

    // Location validation
    if (!formData.location || !formData.location.address) {
        errors.location = errorMessages.booking.locationRequired;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const handleBookingError = (error) => {
    console.error('Booking Error:', error);

    if (error.response) {
        // Server responded with an error
        switch (error.response.status) {
            case 400:
                return error.response.data.message || errorMessages.booking.bookingCreationFailed;
            case 500:
                return errorMessages.general.serverError;
            default:
                return errorMessages.general.unknownError;
        }
    } else if (error.request) {
        // Request made but no response received
        return errorMessages.general.networkError;
    } else {
        // Something happened in setting up the request
        return errorMessages.general.unknownError;
    }
};
