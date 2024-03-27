import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phind",
  description: "A Phind clone built with Next.js and FastAPI for fun!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark">
        {children}
      </body>
    </html>
  );
}