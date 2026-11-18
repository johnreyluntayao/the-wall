import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Wall",
  description: "A 2008-style social wall.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
