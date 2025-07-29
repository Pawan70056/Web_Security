const { Router } = require('express');
const {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct,
    approveProduct,
    productPagination,
    getAllProductsByUserId,
    addToCart,
    getCartItems,
    removeCartItem,
    addFavoriteProduct,
    removeFavoriteProduct,
    getFavoriteProducts,
    // checkFavoriteStatus
    searchProducts,
    createReview,
    getProductReviews,
    updateReview
} = require('../controllers/productController.js');
const { authGuard, adminGuard } = require('../middleware/authGuard.js');

const router = Router();

router.post('/create', createProduct);

// Fetch all products
router.get('/get_all_products', getAllProducts);

// Fetch single product
router.get('/get_single_product/:id', getProduct);

// Delete product
router.delete('/delete_product/:id', authGuard, deleteProduct);

// approve the product
router.put('/approve_product/:id', adminGuard, approveProduct);

// pagination
router.get('/pagination', productPagination);

router.get('/get_all_product_by_userid/:id', getAllProductsByUserId)

// Cart operations
router.post('/add_cart', authGuard, addToCart);
router.delete('/remove_cart/:productId', authGuard, removeCartItem);
router.get('/get_cart', authGuard, getCartItems);

// Add to favorites route
router.post('/add_favorite', authGuard, addFavoriteProduct);

// Remove from favorites route
router.delete('/remove_favorite/:productId', authGuard, removeFavoriteProduct);

// Get favorite products route
router.get('/favorites/:id', authGuard, getFavoriteProducts);

//search
router.get('/search', searchProducts)

// Review operations
router.post('/create_review', authGuard, createReview);
router.get('/reviews/:id', authGuard, getProductReviews);

router.post('/update_review', authGuard, updateReview);


module.exports = router;
