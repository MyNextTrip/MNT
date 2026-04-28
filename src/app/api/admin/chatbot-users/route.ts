import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ChatbotUser from "@/lib/models/ChatbotUser";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await ChatbotUser.find({}).sort({ timestamp: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("Fetch Chatbot Users Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await connectToDatabase();
    await ChatbotUser.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Delete Chatbot User Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
