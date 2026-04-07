import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId || userId === "undefined" || userId.length !== 24) {
      return NextResponse.json({ success: false, message: "Valid User ID is required" }, { status: 400 });
    }
    
    // Fetch bookings for the specific user
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error("Fetch User Bookings Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
