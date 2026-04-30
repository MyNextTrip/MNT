import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  bookingId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Signup',
    required: false 
  },
  userName: { type: String, required: false },
  userEmail: { type: String, required: false },
  guestName: { type: String, required: true },
  guestPhone: { type: String, required: false },
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel',
    required: true 
  },
  hotelName: { type: String, required: true },
  hotelAddress: { type: String, required: false },
  roomType: { type: String, required: true },
  roomsCount: { type: Number, default: 1 },
  hasBreakfast: { type: Boolean, default: false },
  mealPlan: { 
    type: String, 
    enum: ['EP', 'CP', 'MAP', 'AP'], 
    default: 'EP' 
  },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  balanceAmount: { type: Number, required: true },
  paymentType: { 
    type: String, 
    required: true, 
    enum: ['Prepaid', 'Partial', 'PayAtHotel'] 
  },
  paymentStatus: { 
    type: String, 
    default: 'Paid',
    enum: ['Paid', 'Pending', 'Failed']
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  numberOfNights: { type: Number, required: true },
  bookingSource: { type: String, required: true },
  assignedRoomNumber: { type: String },
  paymentMethod: { type: String },
  reservationStatus: { 
    type: String, 
    default: 'Confirmed',
    enum: ['Confirmed', 'Pending', 'Cancelled', 'No-show', 'Checked-In', 'Confirm Booking', 'Unfirm Booking Inquiry', 'Online failed Booking', 'Hold Confirm Booking', 'Hold Unconfirm Booking']
  },
  bookingDate: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'bookings' });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
