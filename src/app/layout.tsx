import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "thirdweb SDK + Next starter",
  description:
    "Starter template for using thirdweb SDK with Next.js App router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-gradient-to-b from-black via-gray-900 to-black text-purple-200 min-h-screen`}
      >
        <ThirdwebProvider>
          <Navbar />
          <main className="px-4 sm:px-6 lg:px-8">{children}</main>
          <Footer />
        </ThirdwebProvider>
      </body>
    </html>
  );
}
