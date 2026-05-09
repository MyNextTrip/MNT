import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },
  employeeCode: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v: string) {
        // 5 characters: alphabet + number + special char
        return v.length === 5;
      },
      message: (props: any) => `${props.value} is not a valid employee code! It must be exactly 5 characters.`
    }
  },
  hotelName: { type: String }, // Cached for easier display
  photo: { type: String } // Optional professional photo URL
}, { timestamps: true, collection: 'staff' });

export const Staff = mongoose.models.Staff || mongoose.model('Staff', StaffSchema);
