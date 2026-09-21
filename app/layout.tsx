import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Item Value Tracker",
  description: "Track purchase cost, depreciation and resale value."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}