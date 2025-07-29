import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './../css/navbar.css'; // Import the CSS file

export const Navbar = () => {
    const navigate = useNavigate();

    const scrollToContact = (event) => {
        event.preventDefault();
        const contactSection = document.getElementById('social-media');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToAbout = (event) => {
        event.preventDefault();
        const aboutSection = document.getElementById('about-us');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const goToHome = (event) => {
        event.preventDefault();
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src="/assets/images/website_logo.png" alt="Logo" style={{ maxHeight: '50px' }} />
                    <span className="navbar-brand-text">Himalayan Treasures</span>
                </Link>
                <button className="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link text-light" href="/" onClick={goToHome}>Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-light" href="#about-us" onClick={scrollToAbout}>About Us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-light" href="#contact-us" onClick={scrollToContact}>Contact Us</a>
                        </li>
                        <li className="nav-item">
                            <Link to="/register" className="btn12 btn  btn-outline-danger me-2 text-light">Register</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/login" className="btn12 btn btn-outline-success text-light">Login</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};
