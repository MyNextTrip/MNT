import { Metadata } from "next";
import LoginClient from "@/components/LoginClient";

export const metadata: Metadata = {
  title: "Login to Your Account | MyNextTrip",
  description: "Access your MyNextTrip account to manage bookings and explore exclusive travel deals.",
  robots: {
    index: false,
    follow: true,
  }
};

export default function LoginPage() {
  return <LoginClient />;
}
