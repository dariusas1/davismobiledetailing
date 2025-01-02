const Service = require('../models/Service');
const { validateService } = require('../utils/validation');
const { handleAsync } = require('../utils/errorHandler');

// Get all services
exports.getAllServices = handleAsync(async (req, res) => {
    const { category, vehicleType, sort = 'price', active = true } = req.query;
    const query = { isActive: active };

    if (category) query.category = category;
    if (vehicleType) query.vehicleTypes = vehicleType;

    const services = await Service.find(query)
        .sort(sort)
        .populate('category', 'name')
        .lean();

    // Add dynamic pricing adjustments
    const servicesWithDynamicPricing = services.map(service => ({
        ...service,
        price: calculateDynamicPrice(service)
    }));

    res.json(servicesWithDynamicPricing);
});

// Get service by ID
exports.getServiceById = handleAsync(async (req, res) => {
    const service = await Service.findById(req.params.id)
        .populate('category', 'name')
        .lean();

    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }

    // Add dynamic pricing and availability
    const serviceWithDetails = {
        ...service,
        price: calculateDynamicPrice(service),
        availability: await checkServiceAvailability(service._id)
    };

    res.json(serviceWithDetails);
});

// Create new service
exports.createService = handleAsync(async (req, res) => {
    const { error } = validateService(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const service = new Service({
        name: req.body.name,
        description: req.body.description,
        shortDescription: req.body.shortDescription,
        price: req.body.price,
        duration: req.body.duration,
        category: req.body.category,
        vehicleTypes: req.body.vehicleTypes,
        features: req.body.features,
        image: req.body.image,
        popular: req.body.popular || false,
        rating: req.body.rating || 0,
        dynamicPricingFactors: req.body.dynamicPricingFactors || {
            demand: 1,
            seasonal: 1,
            vehicleSize: 1,
            timeOfDay: 1
        },
        isActive: req.body.isActive || true
    });

    await service.save();
    res.status(201).json(service);
});

// Update service
exports.updateService = handleAsync(async (req, res) => {
    const { error } = validateService(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const service = await Service.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
    );

    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
});

// Delete service
exports.deleteService = handleAsync(async (req, res) => {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
});

// Get service recommendations
exports.getRecommendations = handleAsync(async (req, res) => {
    const { vehicleType, lastService, preferences } = req.query;
    
    const query = { isActive: true };
    if (vehicleType) query.vehicleTypes = vehicleType;

    let services = await Service.find(query)
        .populate('category', 'name')
        .lean();

    // Apply recommendation logic
    services = services.map(service => ({
        ...service,
        score: calculateRecommendationScore(service, {
            vehicleType,
            lastService,
            preferences
        })
    }));

    // Sort by recommendation score
    services.sort((a, b) => b.score - a.score);

    res.json(services.slice(0, 5)); // Return top 5 recommendations
});

// Helper function to calculate dynamic price
const calculateDynamicPrice = (service) => {
    const { price, dynamicPricingFactors } = service;
    const {
        demand = 1,
        seasonal = 1,
        vehicleSize = 1,
        timeOfDay = 1
    } = dynamicPricingFactors;

    // Get current hour to determine time of day factor
    const hour = new Date().getHours();
    const timeOfDayFactor = getTimeOfDayFactor(hour);

    // Calculate final price with all factors
    const dynamicPrice = price * demand * seasonal * vehicleSize * timeOfDayFactor;

    // Round to 2 decimal places
    return Math.round(dynamicPrice * 100) / 100;
};

// Helper function to get time of day pricing factor
const getTimeOfDayFactor = (hour) => {
    if (hour >= 9 && hour <= 17) return 1; // Normal hours
    if (hour >= 18 && hour <= 20) return 1.2; // Peak evening hours
    return 0.9; // Off-peak hours
};

// Helper function to check service availability
const checkServiceAvailability = async (serviceId) => {
    // Implement availability logic based on bookings and staff
    // This is a placeholder implementation
    return {
        available: true,
        nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000),
        slots: []
    };
};

// Helper function to calculate recommendation score
const calculateRecommendationScore = (service, criteria) => {
    let score = 0;

    // Vehicle type match
    if (criteria.vehicleType && service.vehicleTypes.includes(criteria.vehicleType)) {
        score += 3;
    }

    // Popular services get a boost
    if (service.popular) {
        score += 2;
    }

    // Higher rated services get a boost
    score += service.rating;

    // Add more scoring factors based on preferences
    if (criteria.preferences) {
        const prefs = JSON.parse(criteria.preferences);
        if (prefs.priceRange) {
            const inRange = service.price >= prefs.priceRange[0] && 
                          service.price <= prefs.priceRange[1];
            if (inRange) score += 2;
        }
    }

    return score;
}; 