import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nice Choice — Moving & Web Design Services",
  description:
    "Thoughtfully designed moving and web services. Get a full site build or a straightforward move — starting at $700.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}