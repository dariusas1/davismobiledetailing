import './Footer.css';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <>
            <div style={{ height: '150px', overflow: 'hidden' }}>
                <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
                    <path d="M-6.77,75.50 C134.31,175.17 297.40,-24.16 510.72,98.20 L520.31,328.13 L0.00,150.00 Z"
                        style={{ stroke: 'none', fill: '#f2f2f2' }}>
                    </path>
                </svg>
            </div>
            <footer className="footer">
                <img className="footer-logo" src={logo} alt="Precision Detailing Logo" />
                <div className="footer-content">
                    <div>
                        <p className="footer-heading">Contact</p>
                        <div className="footer-contact-group">
                            <p className="footer-contact-group-heading">Text/Call at:</p>
                            <p>408-634-9181</p>
                        </div>
                        <div className="footer-contact-group">
                            <p className="footer-contact-group-heading">Email at:</p>
                            <a href="mailto:precisiondetailing@gmail.com">precisiondetailing@gmail.com</a>
                        </div>
                    </div>
                    <div>
                        <p className="footer-heading">Links</p>
                        <div className="footer-links">
                            <Link to={"/"}>Home</Link>
                            <Link to={"/packages"}>Packages</Link>
                            <Link to={"/contact"}>Contact</Link>
                        </div>
                    </div>
                    <div>
                        <p className="footer-heading">Hours</p>
                        <p>Monday-Saturday</p>
                        <p>8am-6pm</p>
                    </div>
                    <div>
                        <p className="footer-heading">Service Locations</p>
                        <p>San Jose</p>
                        <p>Santa Clara</p>
                        <p>Sunnyvale</p>
                        <p>Mountain View</p>
                        <p>Palo Alto</p>
                    </div>
                </div>
            </footer>
        </>
    )
};

export default Footer;
