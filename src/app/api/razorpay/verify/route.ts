import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import connectToDatabase from "@/lib/mongodb";
import { Booking } from "@/lib/models/Booking";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // 1. Connect to DB
      await connectToDatabase();

      // 2. Fetch Order from Razorpay to get notes (metadata)
      const order = await razorpay.orders.fetch(razorpay_order_id);
      const notes = order.notes as any;

      // 3. Generate Unique Booking ID (e.g., MNT-123456)
      const bookingId = "MNT-" + Math.random().toString(36).substring(2, 8).toUpperCase();

      // 4. Save Booking to MongoDB
      const newBooking = await Booking.create({
        bookingId: bookingId,
        userId: notes.userId,
        userName: notes.userName,
        userEmail: notes.userEmail,
        hotelId: notes.hotelId,
        hotelName: notes.hotelName,
        hotelAddress: notes.hotelAddress,
        roomType: notes.roomType,
        mealPlan: notes.mealPlan,
        hasBreakfast: notes.hasBreakfast,
        totalAmount: notes.totalAmount,
        paidAmount: notes.totalAmount, // Default to total for Prepaid
        balanceAmount: 0,              // Default to 0 for Prepaid
        paymentType: notes.paymentType || 'Prepaid',
        paymentStatus: 'Paid',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        checkInDate: notes.checkInDate,
        checkOutDate: notes.checkOutDate,
        numberOfNights: notes.numberOfNights,
        bookingSource: notes.bookingSource,
        guestName: notes.guestName,
        guestPhone: notes.guestPhone,
      });

      // Special handling for partial payments
      if (notes.paymentType === 'Partial') {
        newBooking.paidAmount = notes.paidAmount;
        newBooking.balanceAmount = notes.totalAmount - notes.paidAmount;
        await newBooking.save();
      }
      
      return NextResponse.json({ 
        success: true, 
        message: "Payment verified and booking saved", 
        bookingId: bookingId 
      });
    } else {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
