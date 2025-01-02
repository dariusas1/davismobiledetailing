import React, { useState } from 'react';
import './Hero.css';
import Icon from '../../components/Icon/Icon';
import heroImage from '../../assets/images/hero.jpg';

const Hero = () => {
    const [videoError, setVideoError] = useState(false);

    return (
        <section className="hero">
            <div className="video-background">
                {!videoError ? (
                    <video 
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        className="hero-video"
                        onError={() => setVideoError(true)}
                    >
                        <source src={require('../../assets/images/hero-background.mp4')} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <img 
                        src={heroImage} 
                        alt="Precision Detailing Hero Background" 
                        className="hero-fallback-image"
                    />
                )}
                <div className="video-overlay"></div>
            </div>
            <div className="hero-content">
                <p className="hero-title">Precision Detailing</p>
                <p className="hero-subtitle">Mobile Car Detailing Services</p>
                <div className="hero-items">
                    <div className="hero-item">
                        <Icon className={"hero-item-icon"} name={"calendar_month"} />
                        <p className="hero-item-bio">Choose a Detailing Plan and Fill Out Scheduling Request</p>
                    </div>
                    <div className="hero-item">
                        <Icon className={"hero-item-icon"} name={"mark_chat_read"} />
                        <p className="hero-item-bio">We Reach Out and Complete Scheduling</p>
                    </div>
                    <div className="hero-item">
                        <Icon className={"hero-item-icon"} name={"directions_car"} />
                        <p className="hero-item-bio">A Detailer Will Come to You and Professionally Detail Your Vehicle</p>
                    </div>
                </div>
                <a href="#booking" className="hero-cta">
                    Book Now
                </a>
            </div>
        </section>
    )
};

export default Hero;
