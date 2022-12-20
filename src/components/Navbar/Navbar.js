import './Navbar.css';
import { useEffect, useState } from 'react';
import logo from '../../assets/images/logo.png';

const Navbar = ({ Link }) => {
    const [isActive, setIsActive] = useState(false);
    // const [isHomePage, setIsHomePage] = useState(false);
    // useEffect(() => {
    //     const navbar = document.querySelector(".navbar");
    //     window.onscroll = () => {
    //         if (window.scrollY > 0 && isHomePage === true) {
    //             navbar.classList.add("scrolled");
    //         } else {
    //             navbar.classList.remove("scrolled");
    //         }
    //     };
    // }, []);
    return (
        <nav className="navbar">
            <div className="navbar-content-mobile">
                <img src={logo} alt="Logo" />
                <div className={(isActive ? "active" : "")} id="mobile-bars"
                    onClick={() => isActive ? setIsActive(false) : setIsActive(true)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className={"navbar-dropdown" + (isActive ? " active" : "")}>
                    <Link className="navbar-dropdown-link" to="/">HOME</Link>
                    <Link className="navbar-dropdown-link" to="/packages">PACKAGES</Link>
                    {/* <Link className="navbar-dropdown-link" to="/dashboard">DASHBOARD</Link> */}
                    <Link className="navbar-dropdown-link" to="/contact">CONTACT</Link>
                </div>
            </div>
            <div className="navbar-content">
                <img src={logo} alt="Logo" />
                <div className="navbar-links">
                    <Link className="navbar-link" to="/">HOME</Link>
                    <Link className="navbar-link" to="/packages">PACKAGES</Link>
                    {/* <Link className="navbar-link" to="/dashboard">DASHBOARD</Link> */}
                    <Link className="navbar-link" to="/contact">CONTACT</Link>
                </div>
            </div>
        </nav >
    )
};

export default Navbar;
