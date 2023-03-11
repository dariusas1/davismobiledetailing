import './Footer.css';
import logo from '../../assets/images/logo.png';

const Footer = ({ Link }) => {
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
                <img className="footer-logo" src={logo} alt="Davis Mobile Detailing Logo" />
                <div className="footer-content">
                    <div>
                        <p className="footer-heading">Contact</p>
                        <p>(480)-285-9857</p>
                        <a href="mailto:davismobiledetailingaz@gmail.com">davismobiledetailingaz@gmail.com</a>
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
                        <p>Phoenix</p>
                        <p>Chandler</p>
                        <p>Gilbert</p>
                        <p>Queen Creek</p>
                        <p>South Mesa</p>
                    </div>
                </div>
            </footer>
        </>
    )
};

export default Footer;
