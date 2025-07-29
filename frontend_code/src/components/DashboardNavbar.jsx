import './../css/dashboardNavbar.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PostPage from '../pages/post/Postpage';
import { searchApi, logoutUserApi } from '../apis/Api'; // Import your search API function
import { toast } from 'react-toastify';

const DashboardNavbar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleNavigateToDashboard = () => {
        window.location.href = '/dashboard';
    };

    const handleLogout = async () => {
        try {
            await logoutUserApi();
            localStorage.clear();
            toast.success("Logged out successfully.");
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed. Please try again.");
        }
    };


    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await searchApi({ params: { search: searchTerm } });
            if (response.data.success) {
                onSearch(response.data.products);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
            toast.error("Search failed.");
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top py-2">
                <div className="container-fluid">
                    <Link className="navbar-brand d-flex align-items-center" onClick={handleNavigateToDashboard}>
                        <img src="/assets/images/website_logo.png" alt="Logo" height="40" width="40" className="rounded-circle me-2" />
                        <span className="brand-text">Himalayan Treasures</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarContent">
                        <form className="d-flex mx-auto my-2 my-lg-0 search-form" role="search" onSubmit={handleSearchSubmit}>
                            <input
                                type="search"
                                placeholder="Search"
                                className="form-control me-2"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                            />
                            <button className="btn btn-outline-light" type="submit">Search</button>
                        </form>
                        <ul className="nav-ul mb-1 mb-lg-0 d-flex justify-content-evenly align-items-center">
                            <li className="nav-item mx-3 dropdown">
                                <button className="btn nav-link dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="fas fa-user nav-icon"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center" to="/profile">
                                            <i className="fas fa-user me-2"></i> Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="dropdown-item">
                                            <i className="fas fa-sign-out-alt me-2"></i> Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item mx-3">
                                <Link className="nav-link" to="/favorites">
                                    <i className="fas fa-heart nav-icon"></i>
                                </Link>
                            </li>
                            <li className="nav-item mx-3">
                                <Link className="nav-link" to="/cart">
                                    <i className="fas fa-shopping-cart nav-icon"></i>
                                </Link>
                            </li>
                            <li className="nav-item mx-3">
                                <button className="btn btn-primary d-flex align-items-center btn-brand rounded-5" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <i className="fas fa-plus-square icon me-2"></i>
                                    Post
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <PostPage />
        </>
    );
};

export default DashboardNavbar;
