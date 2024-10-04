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
				background: "#171821",
				error: "#991b1b",
			},
		},
	},
	plugins: [],
};
export default config;
