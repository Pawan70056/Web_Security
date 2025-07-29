const path = require('path');
const fs = require('fs');
const Products = require('../models/productModel.js');
const User = require('../models/userModel.js');
const mongoose = require('mongoose');
const Review = require('../models/reviewModel.js');

const createProduct = async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    const { productTitle, productPrice, productCategory, productDescription, productLocation, createdBy } = req.body;

    if (!productTitle || !productPrice || !productCategory || !productDescription || !productLocation || !createdBy) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    if (!req.files || !req.files.productImage) {
        return res.status(400).json({
            success: false,
            message: "Image not found"
        });
    }

    const { productImage } = req.files;
    const imageName = `${Date.now()}-${productImage.name}`;
    const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`);

    try {
        await productImage.mv(imageUploadPath);

        const newProduct = new Products({
            productTitle: productTitle,
            productPrice: productPrice,
            productCategory: productCategory,
            productDescription: productDescription,
            productImage: imageName,
            productLocation: productLocation,
            createdBy: createdBy,
        });

        const product = await newProduct.save();
        res.status(201).json({
            success: true,
            message: "Product Created",
            data: product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        });
    }
};

// fetch all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Products.find({});
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        });
    }
};

// fetch single product
const getProduct = async (req, res) => {
    const productId = req.params.id;
    console.log('Product ID:', productId);
    try {
        const product = await Products.findById(productId);
        res.status(200).json({
            success: true,
            message: "Product fetched",
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error
        });
    }
};

// delete product
const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    const userId = req.user.id;  // Assuming you have user information in req.user

    try {
        const existingProduct = await Products.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (existingProduct.createdBy !== userId && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Permission denied"
            });
        }

        const oldImagePath = path.join(__dirname, `../public/products/${existingProduct.productImage}`);

        // delete from file system
        fs.unlinkSync(oldImagePath);

        await Products.findByIdAndDelete(productId);
        res.status(200).json({
            success: true,
            message: "Product deleted"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        });
    }
};

// approve product
const approveProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Products.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.isApproved = true; // Assuming you have an 'isApproved' field in your product schema
        await product.save();

        res.status(200).json({
            success: true,
            message: "Product approved successfully",
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        });
    }
};

// pagination
const productPagination = async (req, res) => {
    const resultPerPage = 4;
    const pageNo = parseInt(req.query._page) || 1;
    const category = req.query.category || ''; // Get category from query parameters

    try {
        // Construct the query object
        let query = {};
        if (category) {
            query.productCategory = category;
        }

        // Get the total number of products matching the query
        const totalProducts = await Products.countDocuments(query);

        // Fetch products matching the query with pagination
        const products = await Products.find(query)
            .skip((pageNo - 1) * resultPerPage)
            .limit(resultPerPage);

        if (products.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No Product Found!",
                hasMore: false,
                totalProducts,
                resultPerPage
            });
        }

        res.status(200).json({
            success: true,
            message: "Products Fetched",
            products,
            hasMore: products.length === resultPerPage,
            totalProducts,
            resultPerPage
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error!",
            totalProducts,
            resultPerPage
        });
    }
};
const getAllProductsByUserId = async (req, res) => {
    const userId = req.params.id;

    try {
        const product = await Products.find({ createdBy: userId }).exec();
        if (!product) {
            console.log(product);
        }
        res.status(201).json({
            success: true,
            message: "Product Fetched!",
            product: product,
        });

    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: "Server Error!",
        });
    }
}

// Add a product to the cart
const addToCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }

        // Check if the product is already in the cart
        if (!user.cartItem.some(item => item.equals(productId))) {
            user.cartItem.push(productId);
            await user.save();
            return res.status(200).json({ success: true, message: 'Product added to cart' });
        } else {
            return res.status(400).json({ success: false, message: 'Product already in cart' });
        }
    } catch (error) {
        console.error('Error in addToCart:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Remove a product from the cart
const removeCartItem = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { productId } = req.params;

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!Array.isArray(user.cartItem)) {
            user.cartItem = [];
        }

        // Log current cart items
        console.log('Current cart items:', user.cartItem);

        // Remove the product from the cart
        const initialCartLength = user.cartItem.length;
        user.cartItem = user.cartItem.filter(item => item.toString() !== productId);

        // Check if any items were removed
        if (user.cartItem.length === initialCartLength) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }

        // Log updated cart items
        console.log('Updated cart items:', user.cartItem);

        await user.save();

        res.status(200).json({ success: true, message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error in removeCartItem:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
// Get all products in the cart
const getCartItems = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch the user and populate the 'cart' field with product details
        const user = await User.findById(userId).populate({
            path: 'cartItem', // Use 'cartItems' as defined in your schema
            select: 'productTitle productPrice productImage', // Adjust fields as necessary
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log("Cart Items:", user.cartItem); // Log the cart items
        return res.status(200).json({ success: true, cartItem: user.cartItem });
    } catch (error) {
        console.error("Error in getCartItems:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
// add to favourite
const addFavoriteProduct = async (req, res) => {
    try {
        console.log("User from token:", req.user);
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Ensure favorites is an array
        if (!Array.isArray(user.favorites)) {
            user.favorites = [];
        }

        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }

        if (!user.favorites.includes(productId)) {
            user.favorites.push(productId);
            await user.save();
            res.status(200).json({ success: true, message: 'Product added to favorites' });
        } else {
            res.status(400).json({ success: false, message: 'Product already in favorites' });
        }
    } catch (error) {
        console.error('Error in addFavoriteProduct:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const removeFavoriteProduct = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { productId } = req.params; // Use req.params to match the route parameter

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.favorites = user.favorites.filter(favorite => favorite.toString() !== productId);
        await user.save();

        res.status(200).json({ success: true, message: 'Product removed from favorites' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getFavoriteProducts = async (req, res) => {
    try {
        const userId = req.user.id; // From authGuard

        // Fetch the user and populate the 'favorites' field with product details
        const user = await User.findById(userId).populate('favorites');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, favorites: user.favorites });
    } catch (error) {
        console.error("Error in getFavoriteProducts:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// search the products
const searchProducts = async (req, res) => {
    const { search, page, limit, sort } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10; // Default page size
    const sortBy = sort || "createdAt"; // Default sort field (use your preferred default)
    console.log(search);

    try {
        let query = {};

        // Construct the search query
        if (search) {
            query.productTitle = { $regex: search, $options: "i" }; // Case-insensitive search
        }

        // Sorting
        const sortOptions = {};
        if (sortBy) {
            const [field, order] = sortBy.split(","); // e.g., "createdAt,desc"
            sortOptions[field] = order || "asc"; // Default to ascending order if not specified
        }

        // Fetch products with pagination and sorting
        const products = await Products.find(query)
            .sort(sortOptions)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        // Count total documents matching the query
        const totalProducts = await Products.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Products searched successfully",
            products,
            totalPages: Math.ceil(totalProducts / pageSize),
        });
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error,
        });
    }
};

const createReview = async (req, res) => {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const review = new Review({
            productId: productId,
            userId: req.user.id,
            rating: rating,
            comment: comment
        });

        await review.save();

        const product = await Products.findById(productId);

        // Update the average rating and number of reviews
        product.numberOfReviews += 1;
        product.averageRating = ((product.averageRating * (product.numberOfReviews - 1)) + rating) / product.numberOfReviews;

        await product.save();

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        });
    }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
    const productId = req.params.id;

    try {
        const reviews = await Review.find({ productId: productId }).populate('userId', 'fullName');

        res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            reviews
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        });
    }
};

// Update a review
const updateReview = async (req, res) => {
    const { reviewId, rating, comment } = req.body;

    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (!review.isOwner(req.user)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        review.rating = rating;
        review.comment = comment;

        await review.save();

        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
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
    searchProducts,
    createReview,
    getProductReviews,
    updateReview

};
