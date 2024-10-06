import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#15F096",
				secondary: "#9945FF",
				light: "#F8F6FF",
				grayText: "#AAA7B4",
				grayBg: "#1C202E",
				lightGray: "#292F40",
				dark: "#141721",
				background: "#04142C",
				error: "#991b1b",
				pending: "#FFDE21",
			},
			backgroundImage: {
				solanaGradient:
					"linear-gradient(90deg, #9945FF -14.53%, #14F195 145.51%)",
				orangeGradient:
					"linear-gradient(90deg, #FDD83D 0.25%, #9C361E 125.5%)",
			},
		},
	},
	plugins: [],
};
export default config;
