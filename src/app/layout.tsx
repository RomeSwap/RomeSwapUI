import "./globals.css";

// Metadata
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Homepage | LoremSwap",
	description: "Generated by create next app",
};

// Components
import { Poppins } from "next/font/google";

// Font
// import localFont from "next/font/local";
import Navbar from "@/components/navbar";

// Providers
import RainBowKitCustomProvider from "@/providers/rainbowkitprovider";

const poppins = Poppins({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-poppins",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// const nexa = localFont({
// 	src: "./fonts/Nexa-Regular.otf",
// 	variable: "--nexa",
// 	weight: "100 900",
// });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.variable} text-light antialiased`}>
				<RainBowKitCustomProvider>
					<Navbar />
					{children}
				</RainBowKitCustomProvider>
			</body>
		</html>
	);
}
