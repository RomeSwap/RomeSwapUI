"use client";

import React, { useEffect } from "react";
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
import clsx from "clsx";

export default function Navbar() {
	// States
	const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);

	const pathname = usePathname();

	const isLinkActive = (link: string) => {
		return pathname === link || pathname.startsWith(`${link}/`);
	};

	const currentLinkMobile = () => {
		const activeLink = navLinksData.find((link) => isLinkActive(link.href));

		if (activeLink) {
			return (
				<>
					<span>{activeLink.icon}</span>
					<span>{activeLink.name}</span>
				</>
			);
		}
		return (
			<>
				<IoHome />
				<span>Home</span>
			</>
		);
	};

	const toggleMobileDropdown = () => {
		setIsMobileMenuActive(!isMobileMenuActive);
	};

	return (
		<header className="fixed z-40 top-0 left-0 bg-black text-light w-full h-[65px] lg:h-[70px] lg:overflow-hidden">
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
						// asks Kraken bout design
						<div className="absolute top-16 left-0 w-48 bg-dark rounded-lg border border-primary/40 ">
							{navLinksData.map((link, idx) => {
								return (
									<Link
										className={clsx(
											"flex items-center gap-x-2 py-2.5 px-3",
											isLinkActive(link.href)
												? "text-light"
												: "text-grayText",
										)}
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
										className={clsx(
											"transition-all duration-300 ease-in-out",
											isLinkActive(link.href)
												? "opacity-1"
												: "opacity-0",
										)}
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
			<div className="hidden lg:block relative select-none pointer-events-none z-0 w-full h-full">
				<div className="absolute bottom-12 -left-36 w-[600px] h-[600px] bg-[rgba(20,241,149,0.24)] rounded-full blur-[200px]"></div>
				<div className="absolute -top-36 -right-44 w-[600px] h-[600px] bg-[rgba(99,57,249,0.25)] rounded-full blur-[200px]"></div>
			</div>
		</header>
	);
}
