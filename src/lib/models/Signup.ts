import mongoose from 'mongoose';

const SignupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'hotel_admin'],
      default: 'user',
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'signup', // Extracted specifically from user requirements
  }
);

// We check if the model is already compiled to avoid errors in Next.js development mode
export const Signup =
  mongoose.models.Signup || mongoose.model('Signup', SignupSchema);
