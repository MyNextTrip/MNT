import mongoose from 'mongoose';

const HotelListingSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
  },
  ownerMobNo: {
    type: String,
    required: true,
  },
  hotelAddress: {
    type: String,
    required: true,
  },
  whatsappNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export const HotelListing = mongoose.models.HotelListing || mongoose.model('HotelListing', HotelListingSchema);
