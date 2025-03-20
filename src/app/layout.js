"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logout from "./logout";
import "./globals.css";

// Font imports
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Prevent scrolling increment/decrement on number inputs
    const handleWheel = (event) => {
      if (event.target.type === "number") {
        event.preventDefault(); // Disable scroll behavior (increment/decrement)
      }
    };

    // Add event listener on mount
    window.addEventListener("wheel", handleWheel, { passive: false });

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevents rendering on the server

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        {/* Sticky Navigation Bar */}
        <header className="sticky top-0 left-0 right-0 flex items-center justify-between p-4 bg-white z-50 shadow-md">
          {/* Logo */}
          <img src="/logo123.png" alt="Logo" className="max-w-[200px] h-auto" />

          {/* Company Name */}
          <div className="text-xl font-bold flex-grow text-center">
            LOYALTY AUTOMATION PVT LTD
          </div>

          {/* Logout Button */}
          <div className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-300">
            <Logout />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
