import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel Admin | Property Management",
  robots: { index: false, follow: false },
};

export default function HotelAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
