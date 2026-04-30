import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Booking } from '@/lib/models/Booking';
import { Hotel } from '@/lib/models/Hotel';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get('hotelId');

    if (!hotelId) {
      return NextResponse.json({ success: false, message: 'Hotel ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const bookings = await Booking.find({ hotelId });
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
        return NextResponse.json({ success: false, message: 'Hotel not found' }, { status: 404 });
    }

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
    const pendingBookings = bookings.filter(b => b.reservationStatus === 'Pending').length;
    const confirmedBookings = bookings.filter(b => b.reservationStatus === 'Confirmed').length;

    // PMS Metrics Calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalRooms = hotel.rooms.reduce((sum: number, r: any) => sum + (Number(r.count) || 0), 0);
    
    let occupiedCount = 0;
    let arrivingTodayCount = 0;
    let departingTodayCount = 0;

    bookings.forEach(b => {
        if (b.reservationStatus !== 'Confirmed' && b.reservationStatus !== 'Checked-In') return;
        
        const ci = new Date(b.checkInDate); ci.setHours(0, 0, 0, 0);
        const co = new Date(b.checkOutDate); co.setHours(0, 0, 0, 0);
        const rooms = Number(b.roomsCount) || 1;

        // Is guest in-house today? (Check-in <= Today < Check-out)
        if (today >= ci && today < co) {
            occupiedCount += rooms;
        }
        
        // Is guest arriving today?
        if (ci.getTime() === today.getTime()) {
            arrivingTodayCount += rooms;
        }

        // Is guest departing today?
        if (co.getTime() === today.getTime()) {
            departingTodayCount += rooms;
        }
    });

    const vacantCount = Math.max(0, totalRooms - occupiedCount);
    const dirtyCount = departingTodayCount; // Assuming rooms become dirty after check-out
    const blockedCount = 0; // Future feature: manually blocked rooms

    return NextResponse.json({
      success: true,
      stats: {
        totalBookings,
        totalRevenue,
        pendingBookings,
        confirmedBookings,
        pms: {
            vacant: vacantCount,
            occupied: occupiedCount,
            reserve: arrivingTodayCount,
            blocked: blockedCount,
            dueOut: departingTodayCount,
            dirty: dirtyCount,
            totalRooms
        },
        hotelName: hotel.hotelName
      }
    });

  } catch (error: any) {
    console.error('Error fetching hotel stats:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
