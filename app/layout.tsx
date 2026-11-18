import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Wall — A little like 2009",
  description: "A nostalgic public wall. Share a thought, a memory, or a hello. No account needed.",
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
