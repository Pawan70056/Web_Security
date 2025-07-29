import React, { useState, useEffect } from 'react';
import { getAllProducts, deleteSingleProductApi, approveProductApi, getAllBookingsApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import './adminDashboard.css';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [activeSection, setActiveSection] = useState('products');

    useEffect(() => {
        fetchProducts();
        fetchBookings();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await getAllProducts();
            if (res.status === 200) {
                setProducts(res.data.products);
            } else {
                toast.error('Failed to fetch products');
            }
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await getAllBookingsApi();
            if (res.status === 200) {
                console.log("Bookings fetched:", res.data.bookings); 
                setBookings(res.data.bookings);
            } else {
                toast.error('Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to fetch bookings');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            try {
                const res = await deleteSingleProductApi(id);
                if (res.status === 200) {
                    toast.success('Product deleted successfully');
                    setProducts(products.filter(product => product._id !== id));
                } else {
                    toast.error('Failed to delete product');
                }
            } catch (error) {
                toast.error('Error deleting product');
            }
        }
    };

    const handleApprove = async (id) => {
        if (window.confirm('Are you sure you want to approve?')) {
            try {
                const res = await approveProductApi(id);
                if (res.status === 200) {
                    toast.success(res.data.message);
                    setProducts(products.filter(product => product._id !== id));
                } else {
                    toast.error('Failed to approve product');
                }
            } catch (error) {
                toast.error('Error approving product');
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const filteredProducts = products.filter(product => {
        if (filter === 'approved') return product.isApproved;
        if (filter === 'pending') return !product.isApproved;
        return true;
    });

    return (
        <div className="admin-dashboard">
            <nav className="navbar">
                <h1>Admin Dashboard</h1>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </nav>
            <main className="main-content">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className="dashboard-summary">
                            <div className="summary-card" onClick={() => { setFilter('all'); setActiveSection('products'); }}>
                                <h2>Total Products</h2>
                                <p>{products.length}</p>
                            </div>
                            <div className="summary-card" onClick={() => { setFilter('approved'); setActiveSection('products'); }}>
                                <h2>Approved Products</h2>
                                <p>{products.filter(product => product.isApproved).length}</p>
                            </div>
                            <div className="summary-card" onClick={() => { setFilter('pending'); setActiveSection('products'); }}>
                                <h2>Pending Products</h2>
                                <p>{products.filter(product => !product.isApproved).length}</p>
                            </div>
                            <div className="summary-card" onClick={() => setActiveSection('bookings')}>
                                <h2>Total Bookings</h2>
                                <p>{bookings.length}</p>
                            </div>
                        </div>
                        {activeSection === 'products' && (
                            <div className="dashboard-product-cards">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((singleProduct) => (
                                        <div className="dashboard-product-card" key={singleProduct._id}>
                                            <div className="dashboard-image-container">
                                                <img
                                                    src={`http://localhost:8848/products/${singleProduct.productImage}`}
                                                    alt={singleProduct.productTitle}
                                                    className="dashboard-product-image"
                                                />
                                            </div>
                                            <div className="dashboard-product-details">
                                                <h3 className="dashboard-product-title">{singleProduct.productTitle}</h3>
                                                <p className="dashboard-product-price">Price: NPR.{singleProduct.productPrice}</p>
                                                <p className="dashboard-product-category">Category: {singleProduct.productCategory}</p>
                                                <p className="dashboard-product-location">Location: {singleProduct.productLocation}</p>
                                                <p className="dashboard-product-description">Description: {singleProduct.productDescription}</p>
                                                <p className="dashboard-product-postedBy">Posted by: {singleProduct.postedBy}</p>
                                            </div>
                                            <div className="dashboard-button-group">
                                                <button onClick={() => handleApprove(singleProduct._id)} className="btn btn-success">Approve</button>
                                                <button onClick={() => handleDelete(singleProduct._id)} className="btn btn-danger">Delete</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No products available</p>
                                )}
                            </div>
                        )}
                        {activeSection === 'bookings' && (
                            <div className="dashboard-product-cards">
                                {bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                        <div className="dashboard-product-card" key={booking._id}>
                                            <div className="dashboard-image-container">
                                                <img
                                                    src={`http://localhost:8848/products/${booking.productId.productImage}`}
                                                    alt={booking.productId.productTitle}
                                                    className="dashboard-product-image"
                                                />
                                            </div>
                                            <div className="dashboard-product-details">
                                                <h3 className="dashboard-product-title">{booking.productId.productTitle}</h3>
                                                <p className="dashboard-product-price">Price: NPR.{booking.productId.productPrice}</p>
                                                <p className="dashboard-product-category">User: {booking.userId.fullName}</p>
                                                <p className="dashboard-product-location">Quantity: {booking.quantity}</p>
                                                <p className="dashboard-product-description">Booking Date: {new Date(booking.bookingDate).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No bookings found</p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
