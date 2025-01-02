const validator = require('validator');
const { DateTime } = require('luxon');

const validateBooking = {
  // Validate customer name
  customerName: (name) => {
    if (!name) {
      return { 
        isValid: false, 
        error: 'Customer name is required' 
      };
    }      
    
    if (name.length < 2 || name.length > 50) {
      return { 
        isValid: false, 
        error: 'Name must be between 2 and 50 characters' 
      };
    }
    
    return { 
      isValid: true 
    };
  },

  // Validate customer email
  customerEmail: (email) => {
    if (!email) {
      return { 
        isValid: false, 
        error: 'Customer email is required' 
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

  // Validate customer phone
  customerPhone: (phone) => {
    if (!phone) {
      return { 
        isValid: false, 
        error: 'Customer phone number is required' 
      };
    }
    
    const phoneRegex = /^\+?1?\d{10,14}$/;
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

  // Validate service type
  serviceType: (serviceType) => {
    const validServices = [
      'Basic Wash', 
      'Premium Detailing', 
      'Full Ceramic Coating', 
      'Interior Detailing', 
      'Exterior Detailing', 
      'Paint Correction'
    ];
    
    if (!serviceType) {
      return { 
        isValid: false, 
        error: 'Service type is required' 
      };
    }
    
    if (!validServices.includes(serviceType)) {
      return { 
        isValid: false, 
        error: 'Invalid service type' 
      };
    }
    
    return { 
      isValid: true 
    };
  },

  // Validate vehicle type
  vehicleType: (vehicleType) => {
    const validVehicles = [
      'Sedan', 
      'SUV', 
      'Truck', 
      'Van', 
      'Luxury Vehicle', 
      'Sports Car'
    ];
    
    if (!vehicleType) {
      return { 
        isValid: false, 
        error: 'Vehicle type is required' 
      };
    }
    
    if (!validVehicles.includes(vehicleType)) {
      return { 
        isValid: false, 
        error: 'Invalid vehicle type' 
      };
    }
    
    return { 
      isValid: true 
    };
  },

  // Validate booking date
  bookingDate: (date) => {
    if (!date) {
      return { 
        isValid: false, 
        error: 'Booking date is required' 
      };
    }
    
    const bookingDate = DateTime.fromISO(date);
    const now = DateTime.now();
    
    if (!bookingDate.isValid) {
      return { 
        isValid: false, 
        error: 'Invalid date format' 
      };
    }
    
    if (bookingDate < now.startOf('day')) {
      return { 
        isValid: false, 
        error: 'Booking date cannot be in the past' 
      };
    }
    
    if (bookingDate > now.plus({ months: 3 })) {
      return { 
        isValid: false, 
        error: 'Booking date cannot be more than 3 months in advance' 
      };
    }
    
    return { 
      isValid: true 
    };
  },

  // Validate preferred time
  preferredTime: (time) => {
    if (!time) {
      return { 
        isValid: false, 
        error: 'Preferred time is required' 
      };
    }
    
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return { 
        isValid: false, 
        error: 'Invalid time format (HH:MM)' 
      };
    }
    
    return { 
      isValid: true 
    };
  },

  // Validate total price
  totalPrice: (price) => {
    if (!price) {
      return { 
        isValid: false, 
        error: 'Total price is required' 
      };
    }
    
    if (isNaN(price) || price < 0) {
      return { 
        isValid: false, 
        error: 'Price must be a positive number' 
      };
    }
    
    return { 
      isValid: true 
    };
  },

  // Validate complete booking data
  validateBookingData: (bookingData) => {
    const validations = [
      validateBooking.customerName(bookingData.customerName),
      validateBooking.customerEmail(bookingData.customerEmail),
      validateBooking.customerPhone(bookingData.customerPhone),
      validateBooking.serviceType(bookingData.serviceType),
      validateBooking.vehicleType(bookingData.vehicleType),
      validateBooking.bookingDate(bookingData.bookingDate),
      validateBooking.preferredTime(bookingData.preferredTime),
      validateBooking.totalPrice(bookingData.totalPrice)
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

module.exports = validateBooking;
