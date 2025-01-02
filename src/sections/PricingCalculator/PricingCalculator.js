import React, { useState, useEffect } from 'react';
import './PricingCalculator.css';

const PricingCalculator = () => {
    const [vehicleType, setVehicleType] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [additionalServices, setAdditionalServices] = useState([]);
    const [estimatedPrice, setEstimatedPrice] = useState(0);

    const vehicleTypes = [
        { name: 'Sedan', basePrice: 100 },
        { name: 'SUV', basePrice: 150 },
        { name: 'Truck', basePrice: 175 },
        { name: 'Sports Car', basePrice: 200 }
    ];

    const serviceTypes = [
        { name: 'Basic Wash', multiplier: 1 },
        { name: 'Premium Detail', multiplier: 1.5 },
        { name: 'Elite Ceramic Coating', multiplier: 2.5 }
    ];

    const additionalServiceOptions = [
        { name: 'Interior Deep Clean', price: 50 },
        { name: 'Engine Bay Cleaning', price: 75 },
        { name: 'Paint Correction', price: 150 },
        { name: 'Headlight Restoration', price: 75 }
    ];

    useEffect(() => {
        calculatePrice();
    }, [vehicleType, serviceType, additionalServices]);

    const calculatePrice = () => {
        if (!vehicleType || !serviceType) {
            setEstimatedPrice(0);
            return;
        }

        const selectedVehicle = vehicleTypes.find(v => v.name === vehicleType);
        const selectedService = serviceTypes.find(s => s.name === serviceType);

        let basePrice = selectedVehicle.basePrice;
        let servicePriceMultiplier = selectedService.multiplier;

        const additionalServicesCost = additionalServices.reduce((total, service) => {
            const additionalService = additionalServiceOptions.find(s => s.name === service);
            return total + (additionalService ? additionalService.price : 0);
        }, 0);

        const totalPrice = Math.round(
            (basePrice * servicePriceMultiplier) + additionalServicesCost
        );

        setEstimatedPrice(totalPrice);
    };

    const toggleAdditionalService = (serviceName) => {
        setAdditionalServices(prev => 
            prev.includes(serviceName)
                ? prev.filter(s => s !== serviceName)
                : [...prev, serviceName]
        );
    };

    return (
        <section className="pricing-calculator">
            <div className="calculator-container">
                <h2>Pricing Calculator</h2>
                <div className="calculator-form">
                    <div className="form-section">
                        <h3>Vehicle Type</h3>
                        <div className="option-grid">
                            {vehicleTypes.map(vehicle => (
                                <button
                                    key={vehicle.name}
                                    className={`option-btn ${vehicleType === vehicle.name ? 'selected' : ''}`}
                                    onClick={() => setVehicleType(vehicle.name)}
                                >
                                    {vehicle.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Service Type</h3>
                        <div className="option-grid">
                            {serviceTypes.map(service => (
                                <button
                                    key={service.name}
                                    className={`option-btn ${serviceType === service.name ? 'selected' : ''}`}
                                    onClick={() => setServiceType(service.name)}
                                >
                                    {service.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Additional Services</h3>
                        <div className="option-grid">
                            {additionalServiceOptions.map(service => (
                                <button
                                    key={service.name}
                                    className={`option-btn ${additionalServices.includes(service.name) ? 'selected' : ''}`}
                                    onClick={() => toggleAdditionalService(service.name)}
                                >
                                    {service.name} (+${service.price})
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pricing-result">
                        <h3>Estimated Total</h3>
                        <div className="price-display">
                            ${estimatedPrice}
                        </div>
                        <p>* Price may vary based on specific vehicle condition</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingCalculator;
