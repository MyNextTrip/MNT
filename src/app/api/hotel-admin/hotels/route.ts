import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Hotel } from '@/lib/models/Hotel';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get('hotelId');
    
    if (!hotelId) {
      return NextResponse.json({ success: false, message: 'Hotel ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const hotel = await Hotel.findById(hotelId);
    
    if (!hotel) {
      return NextResponse.json({ success: false, message: 'Hotel not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, hotel });
  } catch (error: any) {
    console.error('Error fetching hotel inventory:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get('hotelId');

    if (!hotelId) {
      return NextResponse.json({ success: false, message: 'Hotel ID is required' }, { status: 400 });
    }
    
    const updateData = await req.json();

    await connectToDatabase();
    const hotel = await Hotel.findByIdAndUpdate(hotelId, { ...updateData }, { new: true });

    if (!hotel) {
      return NextResponse.json({ success: false, message: 'Hotel not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, hotel });
  } catch (error: any) {
    console.error('Error updating hotel inventory:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
