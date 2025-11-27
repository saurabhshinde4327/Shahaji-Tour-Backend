const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');
const {
  validateCreateBooking,
  validateUpdateStatus
} = require('../validators/bookingValidator');

router.post('/', validateCreateBooking, BookingController.create);
router.get('/booked-seats/:routeId/:travelDate/:travelTime', BookingController.getBookedSeats);
router.get('/client/:clientId', BookingController.getByClient);
router.get('/:id', BookingController.getById);
router.put('/:id/status', validateUpdateStatus, BookingController.updateStatus);
router.delete('/:id', BookingController.cancel);

module.exports = router;

