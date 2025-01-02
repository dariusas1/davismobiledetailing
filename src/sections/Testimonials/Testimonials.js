import React, { useState } from 'react';
import './Testimonials.css';

const testimonials = [
    {
        name: 'Michael R.',
        text: 'Precision Detailing transformed my car! The attention to detail is incredible. Highly recommended!',
        rating: 5
    },
    {
        name: 'Sarah L.',
        text: 'Professional, punctual, and they did an amazing job. My car looks brand new!',
        rating: 5
    },
    {
        name: 'David K.',
        text: 'Best mobile detailing service in the area. They went above and beyond my expectations.',
        rating: 5
    }
];

const Testimonials = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <section className="testimonials">
            <div className="testimonials-heading">
                <h2>What Our Clients Say</h2>
                <p>Real experiences from satisfied customers</p>
            </div>
            <div className="testimonial-carousel">
                <button className="carousel-btn prev" onClick={prevTestimonial}>&#10094;</button>
                <div className="testimonial-content">
                    <p className="testimonial-text">"{testimonials[currentTestimonial].text}"</p>
                    <div className="testimonial-author">
                        <p>{testimonials[currentTestimonial].name}</p>
                        <div className="testimonial-rating">
                            {renderStars(testimonials[currentTestimonial].rating)}
                        </div>
                    </div>
                </div>
                <button className="carousel-btn next" onClick={nextTestimonial}>&#10095;</button>
            </div>
        </section>
    );
};

export default Testimonials;
