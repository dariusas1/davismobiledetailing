const Joi = require('joi');

const serviceSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(3)
        .max(100)
        .trim(),
    
    description: Joi.string()
        .required()
        .min(20)
        .max(2000),
    
    shortDescription: Joi.string()
        .required()
        .min(10)
        .max(200),
    
    price: Joi.number()
        .required()
        .min(20)
        .max(10000),
    
    duration: Joi.number()
        .required()
        .min(15)
        .max(480), // 8 hours max
    
    category: Joi.string()
        .required()
        .regex(/^[0-9a-fA-F]{24}$/), // MongoDB ObjectId
    
    vehicleTypes: Joi.array()
        .items(Joi.string().valid(
            'Sedan',
            'SUV',
            'Truck',
            'Van',
            'Sports Car',
            'Luxury Vehicle',
            'Electric Vehicle'
        ))
        .min(1)
        .required(),
    
    features: Joi.array()
        .items(Joi.string().min(3).max(200))
        .min(1)
        .required(),
    
    image: Joi.string()
        .required()
        .uri(),
    
    gallery: Joi.array()
        .items(Joi.string().uri()),
    
    popular: Joi.boolean(),
    
    rating: Joi.number()
        .min(0)
        .max(5),
    
    reviewCount: Joi.number()
        .min(0),
    
    dynamicPricingFactors: Joi.object({
        demand: Joi.number().min(0.5).max(2),
        seasonal: Joi.number().min(0.8).max(1.5),
        vehicleSize: Joi.number().min(0.9).max(1.5),
        timeOfDay: Joi.number().min(0.9).max(1.2)
    }),
    
    availability: Joi.object({
        monday: Joi.boolean(),
        tuesday: Joi.boolean(),
        wednesday: Joi.boolean(),
        thursday: Joi.boolean(),
        friday: Joi.boolean(),
        saturday: Joi.boolean(),
        sunday: Joi.boolean()
    }),
    
    timeSlots: Joi.array().items(
        Joi.object({
            startTime: Joi.string()
                .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                .required(),
            endTime: Joi.string()
                .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
                .required(),
            maxBookings: Joi.number()
                .integer()
                .min(1)
                .max(10)
        })
    ),
    
    prerequisites: Joi.array()
        .items(Joi.string().min(3).max(200)),
    
    recommendations: Joi.array()
        .items(Joi.string().min(3).max(200)),
    
    isActive: Joi.boolean(),
    
    metadata: Joi.object({
        createdBy: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        updatedBy: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    })
});

exports.validateService = (data) => {
    return serviceSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: true
    });
};

// Add more validation schemas as needed
exports.validateBooking = (data) => {
    const bookingSchema = Joi.object({
        service: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        
        vehicle: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        
        date: Joi.date()
            .min('now')
            .required(),
        
        time: Joi.string()
            .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .required(),
        
        addOns: Joi.array()
            .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
        
        promotion: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/),
        
        useLoyaltyPoints: Joi.boolean(),
        
        paymentMethod: Joi.object({
            type: Joi.string().valid('square').required(),
            token: Joi.object().required()
        }).required(),
        
        specialInstructions: Joi.string()
            .max(500),
        
        status: Joi.string()
            .valid('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')
    });

    return bookingSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true
    });
};

exports.validateVehicle = (data) => {
    const vehicleSchema = Joi.object({
        make: Joi.string()
            .required()
            .min(2)
            .max(50),
        
        model: Joi.string()
            .required()
            .min(1)
            .max(50),
        
        year: Joi.number()
            .integer()
            .min(1900)
            .max(new Date().getFullYear() + 1)
            .required(),
        
        type: Joi.string()
            .valid(
                'Sedan',
                'SUV',
                'Truck',
                'Van',
                'Sports Car',
                'Luxury Vehicle',
                'Electric Vehicle'
            )
            .required(),
        
        color: Joi.string()
            .required()
            .min(2)
            .max(30),
        
        licensePlate: Joi.string()
            .required()
            .min(2)
            .max(10)
            .uppercase(),
        
        vin: Joi.string()
            .min(17)
            .max(17)
            .uppercase(),
        
        specialInstructions: Joi.string()
            .max(500)
    });

    return vehicleSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true
    });
}; 