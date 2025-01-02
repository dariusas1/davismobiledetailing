import React from 'react';
import './Services.css';

const servicePackages = [
    {
        name: 'Basic Detail',
        price: 99,
        description: 'Perfect for regular maintenance and quick refresh',
        features: [
            'Exterior wash and dry',
            'Wheel cleaning',
            'Interior vacuum',
            'Dashboard and console wipe down'
        ]
    },
    {
        name: 'Premium Detail',
        price: 249,
        description: 'Comprehensive detailing for a showroom-ready finish',
        features: [
            'Full exterior wash and clay bar treatment',
            'Paint correction and waxing',
            'Complete interior deep clean',
            'Leather conditioning',
            'Engine bay cleaning',
            'Headlight restoration'
        ]
    },
    {
        name: 'Elite Ceramic Package',
        price: 499,
        description: 'Ultimate protection and shine for luxury vehicles',
        features: [
            'Full paint correction',
            'Ceramic coating application',
            'Interior and exterior deep detail',
            '2-year ceramic protection warranty',
            'Engine bay detailing',
            'Trim and glass protection'
        ]
    }
];

const Services = () => {
    return (
        <section className="services">
            <div className="services-heading">
                <h2>Our Detailing Packages</h2>
                <p>Choose the perfect service for your vehicle</p>
            </div>
            <div className="services-grid">
                {servicePackages.map((pkg, index) => (
                    <div key={index} className="service-card">
                        <h3>{pkg.name}</h3>
                        <p className="service-description">{pkg.description}</p>
                        <div className="service-price">${pkg.price}</div>
                        <ul className="service-features">
                            {pkg.features.map((feature, featureIndex) => (
                                <li key={featureIndex}>{feature}</li>
                            ))}
                        </ul>
                        <button className="book-service-btn">Book Now</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Services;
