import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: String, required: true },
  count: { type: Number, required: true, default: 1 },
  roomNumbers: { type: String },
  image: { type: String }
});

const ReviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  rating: { type: Number, required: true, default: 5 },
  text: { type: String, required: true },
  images: [{ type: String }],
  videos: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const HotelSchema = new mongoose.Schema({
  hotelName: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  rooms: [RoomSchema],
  amenities: [{ type: String }],
  images: [{ type: String }],
  owner: { type: String, default: "MyNextTrip" },
  googleMapUrl: { type: String },
  reviews: [ReviewSchema]
}, { timestamps: true, collection: 'hotels' });

export const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', HotelSchema);
