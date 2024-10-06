import { Poppins } from "next/font/google";

import localFont from "next/font/local";

const poppins = Poppins({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-poppins",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const coolveticaCompressed = localFont({ src: "./Coolvetica-Compressed.otf" });
const coolveticaRegular = localFont({ src: "./Coolvetica-Regular.otf" });
const coolveticaCrammed = localFont({ src: "./Coolvetica-Crammed.otf" });
const clashGroteskBold = localFont({ src: "./ClashGrotesk-Bold.otf" });
const clashGroteskRegular = localFont({ src: "./ClashGrotesk-Regular.otf" });
const nexa = localFont({ src: "./Nexa-Regular.otf" });

export {
	poppins,
	coolveticaCompressed,
	coolveticaRegular,
	coolveticaCrammed,
	nexa,
	clashGroteskBold,
	clashGroteskRegular,
};
