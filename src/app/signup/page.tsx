import { Metadata } from "next";
import SignupClient from "@/components/SignupClient";

export const metadata: Metadata = {
  title: "Create Your Account | Join MyNextTrip",
  description: "Sign up for MyNextTrip to book luxury hotels and travel packages at unbeatable prices.",
  robots: {
    index: false,
    follow: true,
  }
};

export default function SignupPage() {
  return <SignupClient />;
}
