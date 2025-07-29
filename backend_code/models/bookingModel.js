const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products', // Matches the model name in productModel.js
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Matches the model name in userModel.js
        required: true
    },
    productImage: {
        type: mongoose.Schema.Types.String,
        ref: 'products',
        // required: true
    },
    productPrice: {
        type: mongoose.Schema.Types.Number,
        ref: 'products',
        // required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
}, { timestamps: true });

const Booking = mongoose.model('booking', bookingSchema);

module.exports = Booking;
