"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
import { FaAngleDown, FaWallet } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";
import { PiWallet } from "react-icons/pi";

type CustomConnectWalletBtnProps = {
	className?: string; // Optional className prop
};

const CustomConnectWalletBtn: React.FC<CustomConnectWalletBtnProps> = ({
	className,
}) => (
	<ConnectButton.Custom>
		{({
			account,
			chain,
			openAccountModal,
			openChainModal,
			openConnectModal,
			mounted,
		}) => {
			const ready = mounted;
			const connected = ready && account && chain;

			return (
				<div
					className={clsx(
						"flex items-center h-full text-grayText  rounded-lg ",
						className,
					)}
					onClick={openConnectModal}
					{...(!ready && {
						"aria-hidden": true,
						className: "opacity-0 pointer-events-none select-none",
					})}
				>
					{(() => {
						// Wallet not connected
						if (!connected) {
							return (
								<button
									className={clsx(
										"w-full flex items-center justify-center gap-x-2 xl:gap-x-4 bg-orangeGradient rounded-lg overflow-hidden text-background text-sm font-semibold py-2 px-4 lg:px-6 transition-all duration-300 ease-in-out hover:scale-105",
										className,
									)}
									onClick={openConnectModal}
									type="button"
								>
									<div className="text-2xl">
										<PiWallet />
									</div>
									<div className="">Connect Wallet</div>
								</button>
							);
						}

						// Wrong network
						if (chain.unsupported) {
							return (
								<button
									className="flex items-center gap-x-2 text-orange-500"
									onClick={openChainModal}
									type="button"
								>
									<span className="text-2xl">
										<IoWarning />
									</span>
									<span>Wrong network</span>
								</button>
							);
						}

						// Connected & no error
						return (
							<div className={`h-11 flex items-center gap-x-2`}>
								<button
									className="w-full h-full flex items-center gap-x-2 bg-transparent backdrop-blur-lg px-2 lg:px-4 py-1 lg:py-2 rounded-lg border border-light/10 transition-all duration-300 ease-in-out hover:text-light hover:bg-background/60"
									onClick={openChainModal}
									type="button"
								>
									{/* As we only use neon chain */}
									{/* {chain.hasIcon && (
										<div
											className={`overflow-hidden rounded-full`}
											style={{
												background:
													chain.iconBackground,
											}}
										>
											{chain.iconUrl && (
												<Image
													width={24}
													height={24}
													alt={
														chain.name ??
														"Chain icon"
													}
													src={chain.iconUrl}
												/>
											)}
										</div>
									)} */}
									<div
										className={` flex items-center w-6 h-6 rounded-full`}
									>
										<Image
											width={24}
											height={24}
											alt={chain.name ?? "Chain icon"}
											src="/solana-sol-logo.svg"
										/>
									</div>
									<div className="hidden lg:block w-16 truncate text-ellipsis text-xs">
										{chain.name}
									</div>
									<div className="hidden lg:block text-lg">
										<FaAngleDown />
									</div>
								</button>
								<button
									className="w-full h-full flex items-center gap-x-2 bg-transparent backdrop-blur-lg px-2 lg:px-4 py-1 lg:py-2 rounded-lg border border-light/10 transition-all duration-300 ease-in-out hover:text-light hover:bg-background/60"
									onClick={openAccountModal}
									type="button"
								>
									<div className="text-2xl">
										<FaWallet />
									</div>
									<div className="flex items-center gap-x-1">
										<div className="text-xs">
											{account.displayName}
										</div>
										<div className="text-lg">
											<FaAngleDown />
										</div>
									</div>
								</button>
							</div>
						);
					})()}
				</div>
			);
		}}
	</ConnectButton.Custom>
);

export default CustomConnectWalletBtn;
