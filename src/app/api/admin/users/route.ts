import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Signup } from "@/lib/models/Signup";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Fetch all users sorted by newest first
    const users = await Signup.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("Fetch Admin Users Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
