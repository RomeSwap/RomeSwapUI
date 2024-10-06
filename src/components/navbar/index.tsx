"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { navLinksData } from "./navlinksData";
import CustomConnectWalletBtn from "@/components/button/CustomConnectWalletBtn";
import { useEffect, useState } from "react";
import { RiMenuFoldLine } from "react-icons/ri";
import { FaCircle } from "react-icons/fa6";
import clsx from "clsx";

import { clashGroteskBold } from "@/app/fonts/fonts";
import { GoXCircleFill } from "react-icons/go";

export default function Navbar() {
	const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const pathname = usePathname();

	const isLinkActive = (link: string) => {
		return pathname === link || pathname.startsWith(`${link}/`);
	};

	const toggleMenu = () => {
		setIsMobileMenuActive(!isMobileMenuActive);
	};

	// navbar on scroll
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// Block scroll on mobile menu open
	useEffect(() => {
		if (isMobileMenuActive) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	});

	return (
		<header
			className={clsx(
				"fixed z-40 top-0 left-0 text-light w-full h-[65px] lg:h-[70px] transition-all duration-300 ease-in-out",
				isScrolled
					? " bg-background/90 lg:bg-transparent lg:backdrop-blur-lg"
					: "bg-transparent",
			)}
		>
			<nav className="relative flex items-center justify-between h-full max-w-[300px] md:max-w-2xl lg:max-w-[972px] xl:max-w-screen-xl mx-auto">
				<Link href={"/"}>
					<div className="flex items-center gap-x-2">
						<Image
							src={"/logo.png"}
							width={32}
							height={32}
							alt="RomeSwap Logo"
						/>
						<div
							className={`${clashGroteskBold.className} hidden lg:block font-bold text-3xl`}
						>
							RomeSwap
						</div>
					</div>
				</Link>
				<div className="hidden lg:flex items-center gap-x-4 xl:gap-x-8">
					{navLinksData.map((link, idx) => {
						return (
							<div
								key={idx}
								className={`rounded-lg px-2 py-2.5 w-[111px] ${
									isLinkActive(link.href)
										? "text-white font-semibold"
										: "text-grayText"
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
				<div className="hidden lg:block">
					<CustomConnectWalletBtn />
				</div>
				<button
					className="lg:hidden text-4xl text-primary"
					type="button"
					aria-label="Open menu"
					onClick={toggleMenu}
				>
					<RiMenuFoldLine />
				</button>
			</nav>
			{isMobileMenuActive && (
				<div
					className={clsx(
						"absolute z-50 top-0 w-full min-h-screen backdrop-blur-xl flex flex-col items-center justify-around gap-y-4",
					)}
				>
					<button
						className="absolute right-9 top-4 text-4xl"
						type="button"
						onClick={toggleMenu}
					>
						<GoXCircleFill />
					</button>
					<div className="flex flex-col items-center justify-center gap-y-4">
						{navLinksData.map((link, idx) => {
							return (
								<Link
									className={clsx(
										"text-center gap-x-2 py-2.5 px-3",
										isLinkActive(link.href)
											? "text-light"
											: "text-grayText",
									)}
									href={link.href}
									target={link.isExternal ? "_blank" : ""}
									key={idx}
									onClick={toggleMenu}
								>
									{link.name}
								</Link>
							);
						})}
					</div>
					<div className="max-w-lg mx-auto">
						<CustomConnectWalletBtn />
					</div>
				</div>
			)}
		</header>
	);
}
