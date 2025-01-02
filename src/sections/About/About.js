/* eslint-disable no-unused-vars */
import './About.css';
import React from 'react';
import sideCarImg from '../../assets/images/aboutside.jpg';
import Icon from '../../components/Icon/Icon';

const About = () => {
    return (
        <section className="about">
            <div className="about-heading">
                <p>ABOUT US</p>
                <p>Precision Detailing</p>
            </div>
            <div className="about-content">
                <div className="about-img"></div>
                <div className="about-text">
                    <h2>Professional Mobile Detailing Services</h2>
                    <p>
                        Precision Detailing is a premier mobile car detailing service dedicated to transforming 
                        your vehicle with meticulous care and exceptional craftsmanship. We bring professional 
                        detailing services directly to you, ensuring convenience and top-quality results.
                    </p>
                    <p>
                        Our team of skilled detailers treats every vehicle as a unique masterpiece, using 
                        state-of-the-art techniques and premium products to restore and protect your car's 
                        appearance. Whether you need a comprehensive detail or specific service, we're committed 
                        to exceeding your expectations.
                    </p>
                    <div className="about-stats">
                        <div className="stat">
                            <h3>100%</h3>
                            <p>Customer Satisfaction</p>
                        </div>
                        <div className="stat">
                            <h3>Mobile</h3>
                            <p>Convenient Service</p>
                        </div>
                        <div className="stat">
                            <h3>Premium</h3>
                            <p>Detailing Solutions</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default About;
