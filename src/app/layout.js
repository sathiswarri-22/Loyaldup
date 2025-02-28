"use client"
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from 'next/navigation';
import "./globals.css";
import Logout from "./logout";

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

  // Check if the current path is not the one you want to hide the div on
  const hideDivOnPage = pathname === '/'; // Change '/your-page' to the page you want

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          {/* Conditionally render the top bar */}
          {!hideDivOnPage && (
            <div className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white z-10">
              {/* Logo in the top left corner */}
              <img 
                src="/logo123.png" 
                alt="Logo" 
                className="max-w-[2000px] h-auto"
              />

              {/* Company name centered */}
              <div className="text-xl font-bold flex-grow text-center">
LOYALTY AUTOMATION PVT LTD           
   </div>

              {/* Logout button in the top right corner */}
              <div className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-300"
>
                <Logout />
              </div>
            </div>
          )}

          {/* Main content area */}
          <main className="mt-[60px]"> {/* Add margin top to prevent content from being hidden behind the fixed top bar */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
