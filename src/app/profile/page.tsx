import { Metadata } from "next";
import ProfileClient from "@/components/ProfileClient";

export const metadata: Metadata = {
  title: "My Profile | MyNextTrip Bookings",
  description: "View and manage your hotel bookings, download receipts, and update your travel preferences on MyNextTrip.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function ProfilePage() {
  return <ProfileClient />;
}
