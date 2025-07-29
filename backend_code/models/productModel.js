const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productTitle: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productDescription: {
        type: String,
        required: true,
        maxlength: 300
    },
    productCategory: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    productLocation: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy : {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Products = mongoose.model('products', productSchema);

module.exports = Products;
