const { Router } = require('express');
const { createBooking, getAllBookings, getBookingByBookingUserId, cancelBooking } = require('../controllers/bookingController.js');
const { authGuard, adminGuard } = require('../middleware/authGuard.js');

const router = Router();

router.post('/create', authGuard, createBooking);
router.get('/all', authGuard, getAllBookings);
router.get('/booking/:id', authGuard, getBookingByBookingUserId);
router.put('/cancel/:id', authGuard, cancelBooking);

module.exports = router;
