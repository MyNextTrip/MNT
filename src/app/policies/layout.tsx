import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policies | Privacy, Terms & Cancellation | MNT Brand",
  description: "Read the Privacy Policy, Terms & Conditions, and Cancellation Rules for My Next Trip (MNT). We ensure transparent booking policies and secure travel experiences.",
  keywords: ["privacy policy", "terms and conditions", "cancellation policy", "refund policy", "MNT policies", "legal policies travel"],
  openGraph: {
    title: "Legal & Policies | My Next Trip (MNT) Travel Portal",
    description: "Transparent travel policies, terms of service, and secure booking guidelines.",
    url: "https://www.mynexttrip.in/policies",
  }
};

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
