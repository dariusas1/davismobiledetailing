import './About.css';
import React from 'react';
import sideCarImg from '../../assets/images/aboutside.jpg';

const About = () => {
    return (
        <section className="about">
            <div className="about-heading">
                <p>ABOUT US</p>
                <p>Davis Mobile Detailing</p>
            </div>
            <div className="about-content">
                <div className="about-img">
                    <img src={sideCarImg} alt="blue car" />
                </div>
                <div className="about-card">
                    <p className="about-card-bio">We were founded in and operate out of Chandler, AZ. When you book with us,
                        we bring a professional mobile detailer right to you. We understand the inconvenience of
                        cleaning your own vehicle and strive to make our process as seamless as possible. Thank you for
                        stopping by and considering our services.</p>
                    <div className="about-card-list">
                        <div className="about-card-list-item">
                            <span className="material-symbols-rounded about-list-icon">
                                task_alt
                            </span>
                            <p className="about-list-title">Service Hours (7am-7pm)</p>
                        </div>
                        <div className="about-card-list-item">
                            <span className="material-symbols-rounded about-list-icon">
                                task_alt
                            </span>
                            <p className="about-list-title">Discount on Cash Payments</p>
                        </div>
                        <div className="about-card-list-item">
                            <span className="material-symbols-rounded about-list-icon">
                                task_alt
                            </span>
                            <p className="about-list-title">Flexible Scheduling</p>
                        </div>
                        <div className="about-card-list-item">
                            <span className="material-symbols-rounded about-list-icon">
                                task_alt
                            </span>
                            <p className="about-list-title">Competitive Pricing</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default About;
