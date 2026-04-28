import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consult a Travel Expert | Personalized Itineraries | MNT Brand",
  description: "Get personalized travel advice and custom holiday itineraries from MNT experts. Specializing in Bihar, Jharkhand, and Nepal travel planning.",
  keywords: ["travel expert", "holiday planner patna", "custom trip advisor", "MNT travel consultation", "travel agency bihar"],
  openGraph: {
    title: "Consult a Travel Expert | My Next Trip (MNT)",
    description: "Your dream vacation starts with a conversation. Get expert advice today.",
    url: "https://www.mynexttrip.in/contact-expert",
  }
};

export default function ContactExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
