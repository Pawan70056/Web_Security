import React, { useState } from 'react';
import './../startpage/startpage.css';

const StartPage = () => {
    const [showMessage, setShowMessage] = useState(false);

    const handleClick = () => {
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
        }, 2000);
    };

    return (
        <div className="start-page">
            <section className="hero">
                <div className="hero-content">
                    <h1>Discover the World of Art and Crafts</h1>
                    <p>Welcome to our Art and Crafts Showcase! Immerse yourself in a world of creativity, where talented artisans and craftsmen bring their masterpieces to life. From intricately designed ceramics to captivating paintings, each piece tells a unique story waiting to be discovered. Join us on a journey of inspiration and awe as we celebrate the beauty of human expression through art and crafts.</p>
                    <a href="/login" className="button">Get Started</a>
                </div>
            </section>
            <section id="featured" className="featured">
                <div className="section-content">
                    <h2>Featured Products</h2>
                    <div className="product-gallery">
                        <div className="product" onClick={handleClick}>
                            <img src="/assets/images/customer1.jpg" alt="product1" />
                            <h3>Encyclopedia of Greater Philadelphia</h3>
                            <p>Made with the bamboo and can be used for many purposes like keeping vegetables and others too.</p>
                        </div>
                        <div className="product" onClick={handleClick}>
                            <img src="/assets/images/customer2.jpg" alt="product2" />
                            <h3>Handmade Bamboo Crafts</h3>
                            <p>Mind Blowing Wall Frame | Beautiful Art work for Art Lovers | Village Art - Mother and Childs | Handmade Bamboo Crafts | 100% natural | Say No Plastic.</p>
                        </div>
                        <div className="product" onClick={handleClick}>
                            <img src="/assets/images/customer3.jpg" alt="product3" />
                            <h3>Craving Craft</h3>
                            <p>The Arts and Crafts movement in Greater Philadelphia grew against the backdrop of the area’s increasingly industrial character in the late nineteenth and early twentieth centuries.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section id="about-us" className="about-us">
                <div className="container mt-5 pt-5">
                    <h2 className="mb-4 text-center">About Us</h2>
                    <div className="row mb-5 justify-content-center">
                        <div className="col-md-4 text-center">
                            <img src="/assets/images/artist_image.jpg" alt="Artists" className="img-fluid mb-3" style={{ maxWidth: '100%', height: 'auto' }} />
                            <h3>Our Mission</h3>
                            <p>
                                At Gift Bazar, we provide a platform for talented individuals to showcase their creativity. Whether you're an experienced artisan or just starting, join our community to connect with art enthusiasts worldwide.
                            </p>
                        </div>
                        <div className="col-md-4 text-center">
                            <img src="/assets/images/team_image.jpg" alt="Team" className="img-fluid mb-3" style={{ maxWidth: '100%', height: 'auto' }} />
                            <h3>Our Team</h3>
                            <p>
                                Founded by art enthusiasts, Gift Bazar celebrates handmade creativity. Our team, with backgrounds in art, design, and technology, is dedicated to creating an inclusive space for artists and art lovers.
                            </p>
                        </div>
                        <div className="col-md-4 text-center">
                            <img src="/assets/images/marketplace.jpg" alt="Marketplace" className="img-fluid mb-3" style={{ maxWidth: '100%', height: 'auto' }} />
                            <h3>What We Offer</h3>
                            <ul className="list-unstyled">
                                <li><strong>Platform for Creativity:</strong> Easily upload and showcase handmade creations.</li>
                                <li><strong>Marketplace:</strong> Sell artworks directly to appreciative buyers.</li>
                                <li><strong>Community Engagement:</strong> Interact, share ideas, and inspire each other.</li>
                                <li><strong>Quality Assurance:</strong> Maintain high standards for featured artworks.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>



            <section id="testimonials" className="testimonials">
                <div className="section-content">
                    <h2>What Our Customers Say</h2>
                    <div className="testimonial">
                        <img src="/assets/images/customer1.jpg" alt="Customer 1" />
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam erat volutpat. Mauris nec magna nec mi ultrices semper ac eget eros.</p>
                    </div>
                    <div className="testimonial">
                        <img src="/assets/images/customer2.jpg" alt="Customer 2" />
                        <p>Suspendisse potenti. Donec congue enim non arcu gravida, sed elementum tortor fermentum. Nullam viverra mauris sed tellus efficitur consequat.</p>
                    </div>
                </div>
            </section>

            <section id="social-media" className="social-media">
                <div className="section-content">
                    <h2>Connect With Us</h2>
                    <div className="social-icons">
                        <a href="https://www.facebook.com/"><img src="/assets/images/facebook_logo.png" alt="Facebook" /></a>
                        <a href="https://www.gmail.com"><img src="/assets/images/google_logo.png" alt="Twitter" /></a>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-links">
                    <a href="#about-us">About Us</a>
                    <a className='contact' href="#contact">Contact Us</a>
                </div>
                <div className="copyright">
                    &copy; {new Date().getFullYear()} Art and Crafts Showcase. All rights reserved.
                </div>
            </footer>

            {showMessage && (
                <div className="message">
                    <p>Please login or register to get access.</p>
                </div>
            )}
        </div>
    );
};

export default StartPage;
