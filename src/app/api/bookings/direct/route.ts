import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";

export async function POST(req: NextRequest) {
  try {
    const { 
      userId, 
      userName, 
      userEmail, 
      hotelId, 
      hotelName, 
      hotelAddress, 
      roomType, 
      mealPlan,
      hasBreakfast,
      totalAmount,
      checkInDate,
      checkOutDate,
      numberOfNights,
      bookingSource,
      guestName,
      guestPhone
    } = await req.json();

    // 1. Connect to DB
    await connectToDatabase();

    // 2. Generate Unique Booking ID
    const bookingId = "MNT-H-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    // 3. Save Booking to MongoDB (100% Pay at Hotel)
    const newBooking = await Booking.create({
      bookingId: bookingId,
      userId,
      userName,
      userEmail,
      hotelId,
      hotelName,
      hotelAddress,
      roomType,
      mealPlan,
      hasBreakfast,
      totalAmount,
      paidAmount: 0,
      balanceAmount: totalAmount,
      paymentType: 'PayAtHotel',
      paymentStatus: 'Pending',
      checkInDate,
      checkOutDate,
      numberOfNights,
      bookingSource,
      guestName,
      guestPhone
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Booking confirmed. Please pay at the hotel.", 
      bookingId: bookingId 
    });
  } catch (error: any) {
    console.error("Direct Booking Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
