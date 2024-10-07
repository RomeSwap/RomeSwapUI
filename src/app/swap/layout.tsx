import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Swap | LoremSwap",
};

export default function SwapLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <main className="h-screen overflow-y-hidden">{children}</main>;
}
