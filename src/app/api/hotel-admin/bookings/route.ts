import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';

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
    if (paymentMethod) updateData.paymentMethod = paymentMethod;

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
