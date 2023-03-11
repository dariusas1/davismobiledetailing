import './HomeNavbar.css';
import logo from '../../assets/images/logo.png';
import { useState, useEffect } from 'react';

const HomeNavbar = ({ Link }) => {
    const [isActive, setIsActive] = useState(false);
    useEffect(() => {
        const navbar = document.querySelector(".home-navbar");
        window.onscroll = () => {
            // if (window.scrollY > 0) {
            //     navbar.classList.add("scrolled");
            // } else {
            //     navbar.classList.remove("scrolled");
            // }
            if (window.scrollY === 0) {
                navbar.classList.add("top");
            } else {
                navbar.classList.remove("top");
            }
        };
    }, []);
    return (
        <nav className="home-navbar">
            <div className="home-navbar-content-mobile">
                <img src={logo} alt="Logo" />
                <div className={(isActive ? "active" : "")} id="home-mobile-bars"
                    onClick={() => isActive ? setIsActive(false) : setIsActive(true)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className={"home-navbar-dropdown" + (isActive ? " active" : "")}>
                    <Link className="home-navbar-dropdown-link" to="/">HOME</Link>
                    <Link className="home-navbar-dropdown-link" to="/packages">PACKAGES</Link>
                    <Link className="home-navbar-dropdown-link" to="/contact">CONTACT</Link>
                </div>
            </div>
            <div className="home-navbar-content">
                <div className="home-navbar-logo">
                    <img src={logo} alt="Logo" />
                    <p><span>D</span>avis <span>M</span>obile <span>D</span>etailing</p>
                </div>
                <div className="home-navbar-links">
                    <Link className="home-navbar-link" to="/">HOME</Link>
                    <Link className="home-navbar-link" to="/packages">PACKAGES</Link>
                    <Link className="home-navbar-link" to="/contact">CONTACT</Link>
                </div>
            </div>
        </nav >
    );
};

export default HomeNavbar;
