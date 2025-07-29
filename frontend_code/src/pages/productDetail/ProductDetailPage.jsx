import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Rating from 'react-rating-stars-component';
import { singleProductApi, addToCartApi, getProductReviewsApi, createReviewApi,bookProductApi } from './../../apis/Api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './../productDetail/productDetailPage.css'; 

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await singleProductApi(id);
                if (response.status === 200) {
                    setProduct(response.data.product);
                } else {
                    console.error('Failed to fetch product:', response);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await getProductReviewsApi(id);
                if (response.status === 200) {
                    setReviews(response.data.reviews);
                } else {
                    console.error('Failed to fetch reviews:', response);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchProduct();
        fetchReviews();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            const response = await addToCartApi(id);

            console.log('API Response:', response); 

            if (response.status === 200) {
                toast.success('Product added to cart!');
            } else {
                const data = await response.json(); 
                toast.error(data.message || 'Failed to add product to cart.');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error(error.message || 'Failed to add product to cart.');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === '') {
            toast.error('Please provide a rating and a comment.');
            return;
        }

        try {
            const response = await createReviewApi({ productId: id, rating, comment });
            if (response.status === 201) {
                toast.success('Review submitted successfully!');
                setReviews([...reviews, response.data.data]);
                setRating(0);
                setComment('');
            } else {
                toast.error('Failed to submit review.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.message || 'Failed to submit review.');
        }
    };

    const handleBookNow = async () => {
        if (window.confirm('Are you sure you want to book this product?')) {
            try {
                const response = await bookProductApi({ productId: id, quantity: 1 });
                if (response.status === 201) {
                    toast.success('Booking successful!');
                } else {
                    toast.error('Booking failed. Please try again.');
                }
            } catch (error) {
                console.error('Error booking product:', error);
                toast.error('Error booking product.');
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!product) {
        return <p>Product not found</p>; 
    }

    return (
        <Container className="product-detail-container">
            <Row>
                <Col md={6}>
                    <img
                        src={`http://localhost:8848/products/${product.productImage}`}
                        alt={product.productTitle}
                        className="product-detail-image"
                    />
                </Col>
                <Col md={6}>
                    <h2 className="product-detail-title">Name: {product.productTitle}</h2>
                    <p className="product-detail-price">Price: NPR {product.productPrice}</p>
                    <p className="product-detail-description">
                        Description: {product.productDescription}
                    </p>
                    <p className='product-detail-category'>Category: {product.productCategory}</p>
                    <p className="product-detail-location">Location: {product.productLocation}</p>
                    <div className="product-detail-buttons">
                        <Button variant="warning" onClick={handleBookNow}>Book Now</Button>
                        <Button variant="primary" onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    </div>
                    <div className="product-detail-reviews">
                        <h3>Reviews</h3>
                        {reviews.length === 0 ? (
                            <p>No reviews yet.</p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review._id} className="review">
                                    <p><strong>{review.userId.fullName}</strong></p>
                                    <Rating
                                        count={5}
                                        size={24}
                                        value={review.rating}
                                        edit={false}
                                        activeColor="#ffd700"
                                    />
                                    <p>{review.comment}</p>
                                    <p><small>{new Date(review.createdAt).toLocaleString()}</small></p>
                                </div>
                            ))
                        )}
                        <Form onSubmit={handleReviewSubmit}>
                            <Form.Group controlId="rating">
                                <Form.Label>Rating</Form.Label>
                                <Rating
                                    count={5}
                                    size={24}
                                    value={rating}
                                    onChange={(newRating) => setRating(newRating)}
                                    activeColor="#ffd700"
                                />
                            </Form.Group>
                            <Form.Group controlId="comment">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="mt-3">
                                Submit Review
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetailPage;
