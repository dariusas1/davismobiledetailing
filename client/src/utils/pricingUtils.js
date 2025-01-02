export const SERVICES = [
    { 
        id: 1, 
        name: 'Basic Wash', 
        basePrice: 50, 
        description: 'Quick exterior wash',
        estimatedTime: '1 hour',
        recommendedFor: 'Regular maintenance'
    },
    { 
        id: 2, 
        name: 'Premium Detailing', 
        basePrice: 150, 
        description: 'Comprehensive interior and exterior cleaning',
        estimatedTime: '3-4 hours',
        recommendedFor: 'Deep cleaning and protection'
    }
];

export const VEHICLE_TYPES = [
    { id: 1, name: 'Sedan', multiplier: 1, description: 'Standard passenger car' },
    { id: 2, name: 'SUV', multiplier: 1.2, description: 'Larger vehicle with more surface area' },
    { id: 3, name: 'Truck', multiplier: 1.5, description: 'Large vehicle requiring extra attention' }
];

export const ADDITIONAL_SERVICES = [
    { 
        id: 1, 
        name: 'Engine Bay Cleaning', 
        price: 50, 
        description: 'Thorough cleaning of engine compartment',
        recommendedFor: 'Maintenance and aesthetic improvement'
    },
    { 
        id: 2, 
        name: 'Headlight Restoration', 
        price: 75, 
        description: 'Restore clarity and brightness to headlights',
        recommendedFor: 'Improved visibility and vehicle appearance'
    },
    { 
        id: 3, 
        name: 'Ceramic Coating', 
        price: 300, 
        description: 'Long-lasting protective layer for paint',
        recommendedFor: 'Ultimate paint protection'
    }
];

export const calculateTotalPrice = (serviceId, vehicleTypeId, additionalServiceIds = []) => {
    const service = SERVICES.find(s => s.id === serviceId);
    const vehicleType = VEHICLE_TYPES.find(v => v.id === vehicleTypeId);

    if (!service || !vehicleType) return 0;

    // Base price with vehicle type multiplier
    let totalPrice = service.basePrice * vehicleType.multiplier;

    // Add additional services
    additionalServiceIds.forEach(serviceId => {
        const additionalService = ADDITIONAL_SERVICES.find(s => s.id === serviceId);
        if (additionalService) {
            totalPrice += additionalService.price;
        }
    });

    return totalPrice;
};
