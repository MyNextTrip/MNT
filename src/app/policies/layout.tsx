import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies | Privacy, Terms & Cancellation | MyNextTrip",
  description: "Read the Privacy Policy, Terms & Conditions, and Cancellation Rules for MyNextTrip. We ensure transparent booking policies and secure travel experiences for all our customers.",
  keywords: ["privacy policy", "terms and conditions", "cancellation policy", "refund policy", "booking rules", "mynexttrip policies"],
  openGraph: {
    title: "Legal & Policies | MyNextTrip Travel Portal",
    description: "Transparent travel policies, terms of service, and secure booking guidelines.",
  }
};

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
