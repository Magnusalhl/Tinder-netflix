import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tinder for Movies",
  description: "Find movies to watch together - swipe, match, and enjoy!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {children}
      </body>
    </html>
  );
}
