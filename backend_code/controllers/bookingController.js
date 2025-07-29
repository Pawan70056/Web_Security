const Booking = require('../models/bookingModel');
const Products = require('../models/productModel');
const User = require('../models/userModel'); // Ensure this import

// Create a booking
const createBooking = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || !quantity) {
        return res.status(400).json({
            success: false,
            message: "Product ID and quantity are required"
        });
    }

    try {
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const newBooking = new Booking({
            productId,
            userId,
            quantity
        });

        const booking = await newBooking.save();
        console.log("Booking saved:", booking);
        res.status(201).json({
            success: true,
            message: "Booking created",
            booking
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

// Fetch all bookings
const getAllBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Fetching bookings for userId:", userId);


        let bookingsQuery = Booking.find({});

        if (bookingsQuery) {
            bookingsQuery = bookingsQuery.populate({
                path: 'productId',
                select: 'productTitle productPrice productImage'
            }).populate({
                path: 'userId',
                select: 'fullName'
            });
        }

        const bookings = await bookingsQuery;

        console.log("Fetched bookings:", bookings);  // Log the result

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No bookings found for this user",
            });
        }

        res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            bookings
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
// Fetch a single booking
const getBookingByBookingUserId = async (req, res) => {
    const bookingId = req.params.id;

    try {
        const booking = await Booking.findById(bookingId)
            .populate('productId', 'productTitle productPrice')
            .populate('userId', 'fullName');
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking fetched",
            booking
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

// Cancel a booking
const cancelBooking = async (req, res) => {
    const bookingId = req.params.id;
    const userId = req.user.id;

    try {
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.userId.toString() !== userId && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Permission denied"
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled",
            booking
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

module.exports = {
    createBooking,
    getAllBookings,
    getBookingByBookingUserId,
    cancelBooking
};
