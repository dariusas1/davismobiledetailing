import React from 'react';
import './ServiceArea.css';

const ServiceArea = () => {
    const serviceLocations = [
        { name: 'San Jose', zipCode: '95110', coverage: '20 miles' },
        { name: 'Cupertino', zipCode: '95014', coverage: '15 miles' },
        { name: 'Mountain View', zipCode: '94043', coverage: '25 miles' },
        { name: 'Sunnyvale', zipCode: '94085', coverage: '20 miles' },
        { name: 'Santa Clara', zipCode: '95050', coverage: '15 miles' }
    ];

    return (
        <section className="service-area">
            <div className="service-area-heading">
                <h2>Our Service Area</h2>
                <p>We bring professional detailing services to you</p>
            </div>
            <div className="service-area-map">
                <div className="service-locations">
                    {serviceLocations.map((location, index) => (
                        <div key={index} className="service-location">
                            <h3>{location.name}</h3>
                            <p>Zip Code: {location.zipCode}</p>
                            <p>Coverage Radius: {location.coverage}</p>
                        </div>
                    ))}
                </div>
                <div className="service-area-description">
                    <p>
                        Precision Detailing covers the entire South Bay Area. 
                        If you're within our service radius, we'll come to you! 
                        Not sure if we service your area? Give us a call.
                    </p>
                    <button className="check-coverage-btn">Check Your Coverage</button>
                </div>
            </div>
        </section>
    );
};

export default ServiceArea;
