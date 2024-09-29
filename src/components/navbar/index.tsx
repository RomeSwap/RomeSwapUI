"use client";

// Next
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Data
import { navLinksData } from "./navlinksData";
import CustomConnectWalletBtn from "@/components/button/CustomConnectWalletBtn";
import { useState } from "react";

// Icons
import { IoChevronDown, IoHome, IoSwapHorizontal } from "react-icons/io5";
import { FaCircle } from "react-icons/fa6";

export default function Navbar() {
	const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);

	const pathname = usePathname();

	const isLinkActive = (link: string) => {
		if (link == pathname) {
			return true;
		}
	};

	const currentLinkMobile = () => {
		if (pathname == "/") {
			return (
				<>
					<span className="">
						<IoHome />
					</span>
					<span>Home</span>
				</>
			);
		} else if (pathname == "/swap") {
			return (
				<>
					<span className="">
						<IoSwapHorizontal />
					</span>
					<span>Swap</span>
				</>
			);
		}
	};

	const toggleMobileDropdown = () => {
		setIsMobileMenuActive(!isMobileMenuActive);
	};

	return (
		<header className="fixed z-40 top-0 left-0 bg-black text-light w-full h-[65px] lg:h-[70px] overflow-hidden">
			<nav className="relative flex items-center justify-between h-full max-w-[300px] md:max-w-2xl lg:max-w-[972px] xl:max-w-screen-xl mx-auto">
				<Link href={"/"}>
					<div className="block lg:hidden">
						<Image
							src={"/loremswap-short.svg"}
							width={32}
							height={32}
							alt="Loremswap Logo"
						/>
					</div>
					{/* Desktop */}
					<div className="hidden lg:block">
						<Image
							src={"/loremswap-logo.svg"}
							width={231}
							height={44}
							alt="Loremswap Logo"
						/>
					</div>
				</Link>
				<div className="relative flex lg:hidden w-[129px] bg-dark rounded-lg py-2.5 px-3">
					<button className="" onClick={toggleMobileDropdown}>
						<div className="flex items-center gap-x-2">
							{currentLinkMobile()}
							<span className="text-xl">
								<IoChevronDown />
							</span>
						</div>
					</button>
					{isMobileMenuActive && (
						<div className="absolute top-10 left-0 w-full bg-dark rounded-b-lg">
							{navLinksData.map((link, idx) => {
								return (
									<Link
										className={`flex items-center gap-x-2 py-2.5 px-3 ${
											isLinkActive(link.href)
												? "text-light"
												: "text-grayText"
										}`}
										href={link.href}
										target={link.isExternal ? "_blank" : ""}
										key={idx}
										onClick={toggleMobileDropdown}
									>
										{link.name}
									</Link>
								);
							})}
						</div>
					)}
				</div>
				<div className="hidden lg:flex items-center gap-x-4 xl:gap-x-8">
					{navLinksData.map((link, idx) => {
						return (
							<div
								key={idx}
								className={`rounded-lg px-2 py-2.5 w-[111px] ${
									isLinkActive(link.href) ? "bg-dark" : ""
								}`}
							>
								<Link
									className="w-full flex items-center gap-x-2"
									href={link.href}
									target={link.isExternal ? "_blank" : ""}
								>
									<div
										className={`transition-all duration-300 ease-in-out ${
											isLinkActive(link.href)
												? "opacity-1"
												: "opacity-0"
										}`}
									>
										{link.icon}
									</div>
									<div className="">{link.name}</div>
									{isLinkActive(link.href) && (
										<div className="text-[6px]">
											<FaCircle />
										</div>
									)}
								</Link>
							</div>
						);
					})}
				</div>
				<CustomConnectWalletBtn />
			</nav>
			<div className="relative select-none pointer-events-none z-0 w-full h-full">
				<div className="absolute -top-[520px] -left-[264px]">
					<Image
						src={"/ellipse-green.png"}
						width={900}
						height={900}
						alt="Ellipse"
					/>
				</div>
				<div className="absolute -top-[700px] -right-[364px]">
					<Image
						src={"/ellipse-purple.png"}
						width={1200}
						height={1200}
						alt="Ellipse"
					/>
				</div>
			</div>
		</header>
	);
}
