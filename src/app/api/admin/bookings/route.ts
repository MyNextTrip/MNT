import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Fetch all bookings sorted by newest first
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error("Fetch Admin Bookings Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
