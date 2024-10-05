import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Home() {
	return (
		<main className="flex flex-col items-center justify-center">
			<div className="text-8xl font-semibold max-w-[836px] text-center">
				Trade on{" "}
				<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
					Solana
				</span>{" "}
				with Metamask
			</div>
			<div className="">
				Bring blockchain to the people. Solana supports experiences for
				power users, new consumers, and everyone in between.
			</div>
			<Link
				className="bg-gradient-to-r from-purple-400 to-teal-400 text-white font-bold py-2 px-6 rounded-full shadow-lg"
				href="/swap"
			>
				Get started
			</Link>
			<Image
				className="bg-blend-lighten"
				src="/cool.png"
				width={1322}
				height={973}
				alt="Banner Image"
			/>
		</main>
	);
}
