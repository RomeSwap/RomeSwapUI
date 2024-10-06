import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
	clashGroteskBold,
	clashGroteskRegular,
	coolveticaRegular,
	poppins,
} from "@/app/fonts/fonts";

export default function Home() {
	return (
		<main className="flex flex-col items-center justify-center">
			<section className="flex flex-col lg:flex-row items-center justify-center">
				<div className="w-full lg:h-full flex items-center">
					<Image
						className=""
						src="/colosseum.png"
						width={1196}
						height={1196}
						alt="Banner Image"
					/>
				</div>
				<div className="w-full flex flex-col items-center justify-center gap-y-6 px-4">
					<div
						className={`${coolveticaRegular.className} text-4xl lg:text-5xl xl:text-8xl font-semibold tracking-wider xl:leading-[96px] text-center`}
					>
						Trade on{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
							Solana
						</span>{" "}
						with{" "}
						<span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
							Metamask
						</span>
					</div>
					<p className={`text-paragraph`}>
						Bring blockchain to the people. Solana supports
						experiences for power users, new consumers, and everyone
						in between.
					</p>
					<Link
						className={`w-[270px] text-center bg-solanaGradient text-white py-3 rounded-full shadow-lg text-xl `}
						href="/swap"
					>
						Get started
					</Link>
				</div>
			</section>
			<section className="w-full flex flex-col-reverse lg:flex-row items-center justify-around h-screen xl:pl-48">
				<div
					className={`flex flex-col items-center justify-center gap-5 text-center text-[26px] leading-6 lg:max-w-[537px]`}
				>
					<div className="text-2xl lg:text-[64px] leading-6 lg:leading-[64px]">
						<div className={`${clashGroteskRegular.className}`}>
							About
						</div>
						<div
							className={`${clashGroteskBold.className} text-transparent bg-clip-text bg-[linear-gradient(270deg,_#9945FF_-52.16%,_#14F195_100%)]`}
						>
							Rome Swap
						</div>
					</div>
					<p className={`text-paragraph w-[90%] lg:w-full`}>
						Bring blockchain to the people. Solana supports
						experiences for power users, new consumers, and everyone
						in between. Bring blockchain to the people. Solana
						supports experiences for power users, new consumers, and
						everyone in between.
					</p>
					<Link
						className={`w-[270px] text-center bg-orangeGradient text-white py-3 rounded-full shadow-lg text-xl `}
						href="/swap"
					>
						Get started
					</Link>
				</div>
				<div className="relative flex items-center justify-center">
					<div className="w-full">
						<Image
							className="lg:hidden"
							src="/cool.png"
							width={504}
							height={435}
							alt="Banner"
						/>
						<Image
							className="hidden lg:block"
							src="/cool.png"
							width={1000}
							height={809}
							alt="Banner"
						/>
					</div>
					<div className="absolute">
						<Image
							className="lg:hidden"
							src="/coin-3d-solana.png"
							width={115}
							height={105}
							alt="Solana Coin 3D"
						/>
						<Image
							className="hidden lg:block"
							src="/coin-3d-solana.png"
							width={262}
							height={240}
							alt="Solana Coin 3D"
						/>
					</div>
				</div>
			</section>
		</main>
	);
}
