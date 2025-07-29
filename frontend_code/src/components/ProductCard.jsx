import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToFavoritesApi, removeFavoriteApi } from '../apis/Api';
import './../css/productCard.css'; // Import the CSS file

const ProductCard = ({ productInformation, initialFavoriteStatus }) => {
    const [isFavorite, setIsFavorite] = useState(initialFavoriteStatus);

    useEffect(() => {
        // Set initial favorite status based on props
        setIsFavorite(initialFavoriteStatus);
    }, [initialFavoriteStatus]);

    const handleFavoriteClick = async () => {
        try {
            if (isFavorite) {
                const response = await removeFavoriteApi(productInformation._id);
                if (response.status === 200) {
                    setIsFavorite(false);
                    toast.success('Product removed from favorites!');
                }
            } else {
                const response = await addToFavoritesApi(productInformation._id);
                if (response.status === 200) {
                    setIsFavorite(true);
                    toast.success('Product added to favorites!');
                }
            }
        } catch (error) {
            console.error("Error managing favorites", error);
            toast.error('Failed to update favorite status.');
        }
    };

    return (
        <div className="col-lg-3 col-md-5 col-sm-6 mb-4">
            <div className="thumb-wrapper">
                <div className="wish-icon" onClick={handleFavoriteClick}>
                    <i className={`fa ${isFavorite ? 'fa-heart' : 'fa-heart'}`}></i>
                </div>
                <div className="img-box">
                    <img src={`http://localhost:8848/products/${productInformation.productImage}`} className="img-fluid" alt={productInformation.productTitle} />
                </div>
                <div className="thumb-content">
                    <h4>{productInformation.productTitle}</h4>
                    <p className="item-price">NPR {productInformation.productPrice}</p>
                    <Link to={`/product/${productInformation._id}`} className="btn btn-primary">See More</Link>
                    {/* <button onClick={onRemoveFavorite} className="btn btn-danger">Remove from Favorites</button> */}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
