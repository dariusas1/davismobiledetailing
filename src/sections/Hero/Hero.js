import './Hero.css';
import React from 'react';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <p className="hero-title">Getting a Detail From Us</p>
                <div className="hero-items">
                    <div className="hero-item">
                        <span className="material-symbols-rounded hero-item-icon">
                            calendar_month
                        </span>
                        <p className="hero-item-bio">Choose a Detailing Plan and Fill Out Scheduling Request</p>
                    </div>
                    <div className="hero-item">
                        <span className="material-symbols-rounded hero-item-icon">
                            mark_chat_read
                        </span>
                        <p className="hero-item-bio">We Reach Out and Complete Scheduling</p>
                    </div>
                    <div className="hero-item">
                        <span className="material-symbols-rounded hero-item-icon">
                            directions_car
                        </span>
                        <p className="hero-item-bio">A Detailer Will Come to You and Professionally Detail Your Vehicle</p>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default Hero;
