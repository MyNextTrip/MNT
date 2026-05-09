import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Staff } from "@/lib/models/Staff";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const hotelId = req.nextUrl.searchParams.get("hotelId");
    
    const query = hotelId ? { hotelId } : {};
    const staff = await Staff.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, staff });
  } catch (error: any) {
    console.error("Fetch Staff Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();
    
    const { hotelId, name, designation, employeeCode, hotelName, photo } = data;
    
    if (!hotelId || !name || !designation || !employeeCode) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (employeeCode.length !== 5) {
      return NextResponse.json({ success: false, message: "Employee code must be exactly 5 characters." }, { status: 400 });
    }

    const newStaff = await Staff.create({
      hotelId,
      name,
      designation,
      employeeCode,
      hotelName,
      photo
    });
    
    return NextResponse.json({ success: true, staff: newStaff });
  } catch (error: any) {
    console.error("Create Staff Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const { id, name, designation, employeeCode, photo } = data;

    if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

    if (employeeCode && employeeCode.length !== 5) {
      return NextResponse.json({ success: false, message: "Employee code must be exactly 5 characters." }, { status: 400 });
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      { name, designation, employeeCode, photo },
      { new: true }
    );

    return NextResponse.json({ success: true, staff: updatedStaff });
  } catch (error: any) {
    console.error("Update Staff Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const id = req.nextUrl.searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

    await Staff.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Staff deleted successfully" });
  } catch (error: any) {
    console.error("Delete Staff Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
