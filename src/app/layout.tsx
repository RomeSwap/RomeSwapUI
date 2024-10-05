import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/components/navbar";
import BgEllipseSvgs from "@/components/BgEllipseSvgs";
import RainBowKitCustomProvider from "@/providers/rainbowkitprovider";
import StoreProvider from "@/providers/storeProvider";

export const metadata: Metadata = {
  title: "Homepage | LoremSwap",
  description: "Generated by create next app",
};

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} bg-background text-light antialiased`}
      >
        <StoreProvider>
          <RainBowKitCustomProvider>
            <Navbar />
            {children}
            <BgEllipseSvgs />
          </RainBowKitCustomProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
