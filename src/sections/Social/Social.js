import React from 'react';
import './Social.css';

const socialLinks = [
    {
        platform: 'Instagram',
        url: 'https://instagram.com/precisiondetailing',
        icon: '📸'
    },
    {
        platform: 'Facebook',
        url: 'https://facebook.com/precisiondetailing',
        icon: '👥'
    },
    {
        platform: 'Yelp',
        url: 'https://yelp.com/biz/precision-detailing',
        icon: '⭐'
    }
];

const Social = () => {
    return (
        <section className="social">
            <div className="social-heading">
                <h2>Connect with Precision Detailing</h2>
                <p>Follow us on social media for updates and car care tips</p>
            </div>
            <div className="social-links">
                {socialLinks.map((link, index) => (
                    <a 
                        key={index} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="social-link"
                    >
                        <span className="social-icon">{link.icon}</span>
                        <span className="social-platform">{link.platform}</span>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default Social;
