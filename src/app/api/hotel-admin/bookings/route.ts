import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { Hotel } from '@/lib/models/Hotel';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get('hotelId');

    if (!hotelId) {
      return NextResponse.json({ success: false, message: 'Hotel ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const bookings = await Booking.find({ hotelId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error('Error fetching hotel bookings:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { bookingId, status, assignedRoomNumber, paymentMethod } = await req.json();

    if (!bookingId || !status) {
      return NextResponse.json({ success: false, message: 'Booking ID and status are required' }, { status: 400 });
    }

    await connectToDatabase();
    const updateData: any = { reservationStatus: status };
    if (assignedRoomNumber) updateData.assignedRoomNumber = assignedRoomNumber;
    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
      // When checking in with a payment method, we assume payment is handled
      if (status === 'Checked-In') {
        updateData.paymentStatus = 'Paid';
      }
    }

    const booking = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true });

    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Creating manual booking with data:", data);
    
    const { hotelId, hotelName, guestName, guestPhone, userEmail, checkInDate, checkOutDate, roomType, roomsCount, totalAmount, paymentStatus, reservationStatus, bookingSource, businessSource, companyName } = data;

    if (!hotelId || !guestName || !checkInDate || !checkOutDate) {
      return NextResponse.json({ success: false, message: 'Missing required fields: hotelId, guestName, checkInDate, or checkOutDate' }, { status: 400 });
    }

    await connectToDatabase();

    // Fetch hotel details for completeness and fallbacks
    let hName = hotelName;
    let hAddress = "Address Not Specified";

    try {
      if (hotelId && mongoose.Types.ObjectId.isValid(hotelId)) {
        const hotel = await Hotel.findById(hotelId);
        if (hotel) {
          if (!hName) hName = hotel.hotelName;
          hAddress = hotel.address;
        }
      } else {
        console.warn("Invalid hotelId format:", hotelId);
      }
    } catch (e) {
      console.error("Error fetching hotel info:", e);
    }

    // Generate a simple unique booking ID
    const bookingId = `MNT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const bookingData = {
      bookingId,
      hotelId,
      hotelName: hName || "Unknown Hotel",
      hotelAddress: hAddress,
      guestName,
      guestPhone: guestPhone || "N/A",
      userEmail: userEmail || "",
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      roomType: roomType || "Standard Room",
      roomsCount: Number(roomsCount) || 1,
      totalAmount: Number(totalAmount) || 0,
      paidAmount: Number(totalAmount) || 0,
      balanceAmount: 0,
      paymentType: 'Prepaid',
      paymentStatus: paymentStatus || 'Paid',
      reservationStatus: reservationStatus || 'Confirmed',
      bookingSource: bookingSource || 'Direct',
      businessSource: businessSource || 'Walk In',
      companyName,
      createdAt: new Date(),
      numberOfNights: Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))
    };

    console.log("Final booking data for MongoDB:", bookingData);
    const newBooking = await Booking.create(bookingData);

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: any) {
    console.error('Error creating manual booking:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ 
        success: false, 
        message: 'Validation Error: ' + messages.join(', '), 
        error: error.message 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error during booking creation', 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
