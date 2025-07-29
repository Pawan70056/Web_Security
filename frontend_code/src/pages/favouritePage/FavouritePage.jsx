import React, { useEffect, useState } from 'react';
import { getFavoritesApi, /**removeFavoriteApi**/ } from '../../apis/Api'; 
import ProductCard from '../../components/ProductCard';

const FavoritePage = () => {
    const [favoriteProducts, setFavoriteItems] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await getFavoritesApi();
                if (response.status === 200) {
                    setFavoriteItems(response.data.favorites); 
                } else {
                    console.error('Failed to fetch favorites:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };
        fetchFavorites();
    }, []);

    return (
        <div className="container">
            <div className="row">
                <h2 className='text-center mb-4'>Favorited Products</h2>
                {favoriteProducts.map(product => (
                    <ProductCard
                        key={product._id} productInformation={product}
                        initialFavoriteStatus={true}
                    />

                ))}
            </div>
        </div>
    );
};

export default FavoritePage;
