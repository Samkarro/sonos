import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sonos | Editor",
  description: "A Project by Luka Gogichaishvili",
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
