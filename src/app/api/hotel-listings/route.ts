import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { HotelListing } from '@/lib/models/HotelListing';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    const { hotelName, ownerMobNo, hotelAddress, whatsappNumber } = data;

    if (!hotelName || !ownerMobNo || !hotelAddress || !whatsappNumber) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    const newListing = await HotelListing.create({
      hotelName,
      ownerMobNo,
      hotelAddress,
      whatsappNumber,
    });

    return NextResponse.json({ success: true, listing: newListing }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating hotel listing logic:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const listings = await HotelListing.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, listings }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching hotel listings:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
