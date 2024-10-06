import { Poppins } from "next/font/google";

import localFont from "next/font/local";

const poppins = Poppins({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-poppins",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const clashGroteskBold = localFont({ src: "./ClashGrotesk-Bold.otf" });

export { poppins, clashGroteskBold };
