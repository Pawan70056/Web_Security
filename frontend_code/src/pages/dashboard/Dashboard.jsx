import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination, Button } from 'react-bootstrap';
import { productPagination } from '../../apis/Api';
import './../dashboard/dashboard.css';
import ProductCard from '../../components/ProductCard';
import { toast } from 'react-toastify';
import DashboardNavbar from '../../components/DashboardNavbar';

const DashboardPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');


    useEffect(() => {
        fetchApprovedProducts(currentPage, selectedCategory);
    }, [currentPage, selectedCategory]);

    const fetchApprovedProducts = async (page = 1, category = '') => {
        setLoading(true);
        try {
            const res = await productPagination({ _page: page, category });
            if (res.status === 200) {
                if (res.data.products.length > 0) {
                    const approvedProducts = res.data.products.filter(product => product.isApproved);
                    setProducts(approvedProducts);
                    setTotalPages(Math.ceil(res.data.totalProducts / res.data.resultPerPage));
                } else {
                    setProducts([]);
                    setTotalPages(0);
                    toast.info('No Product Found!');
                }
            } else {
                toast.error('Failed to fetch products:', res);
            }
        } catch (error) {
            toast.error('No Product Available:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (results) => {
        setSearchResults(results);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); 
    };

    const renderPaginationItems = () => {
        const items = [];
        const visiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
        let endPage = Math.min(totalPages, startPage + visiblePages - 1);

        if (endPage - startPage + 1 < visiblePages) {
            startPage = Math.max(1, endPage - visiblePages + 1);
        }

        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
                    {number}
                </Pagination.Item>
            );
        }

        return items;
    };

    return (
        <>
            <DashboardNavbar onSearch={handleSearch} />
            <div className='carousel-container'>
                <div id="carouselExampleIndicators" className='carousel slide p-2' data-bs-ride='carousel'>
                    <div className="carousel-indicators">
                        <button
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            data-bs-slide-to="0"
                            className="active"
                            aria-current="true"
                            aria-label="Slide 1"
                        ></button>
                        <button
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            data-bs-slide-to="1"
                            aria-label="Slide 2"
                        ></button>
                        <button
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            data-bs-slide-to="2"
                            aria-label="Slide 3"
                        ></button>
                    </div>
                    <div className="carousel-inner rounded-4 position-relative">
                        <div className="carousel-item active">
                            <img src="/assets/images/customer1.jpg" className="d-block w-100" alt="Slide 1" />
                            <div className="carousel-caption d-none d-md-block">
                                <h5 className="carousel-caption-text">🎉 Welcome to Himalayan Treasures 🎉</h5>
                                <p className="carousel-caption-subtext">Explore the best of artisanal crafts and unique products!</p>
                            </div>
                        </div>
                        <div className="carousel-item h-25">
                            <img src="/assets/images/marketplace.jpg" className="d-block w-100" alt="Slide 2" />
                            <div className="carousel-caption d-none d-md-block">
                                <h5 className="carousel-caption-text">✨ Discover Unique Finds ✨</h5>
                                <p className="carousel-caption-subtext">Find something special just for you.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src="/assets/images/customer3.jpg" className="d-block w-100" alt="Slide 3" />
                            <div className="carousel-caption d-none d-md-block">
                                <h5 className="carousel-caption-text">🌟 Shop Handmade Treasures 🌟</h5>
                                <p className="carousel-caption-subtext">Handcrafted with love, just for you!</p>
                            </div>
                        </div>
                    </div>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            <Container>
                <Row className="my-4">
                    <Col>
                        <div className="category-container text-center">
                            {['Arts and Crafts', 'Home and Living', 'Wedding', 'Toys and Collectibles'].map((category, index) => (
                                <Button
                                    key={index}
                                    variant="outline-secondary"
                                    className={`category-btn me-2 mb-2 ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                        <h2>Listed Products</h2>
                    </Col>
                </Row>

                {/*Searching the product*/}
                {searchResults.length > 0 ? (
                    <Row className="product-grid">
                        {searchResults.map(product => (
                            <ProductCard key={product._id} productInformation={product} />
                        ))}
                    </Row>
                ) : (
                    <Row className="product-grid">
                        {products.map(product => (
                            <ProductCard key={product._id} productInformation={product} />
                        ))}
                    </Row>
                )}
                {/* Pagination */}
                <Row className="justify-content-center mt-3">
                    <Pagination>
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {renderPaginationItems()}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    </Pagination>
                </Row>
            </Container>
        </>
    );
};

export default DashboardPage;
