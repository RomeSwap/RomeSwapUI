"use client";

// Rainbowkit
import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
import { FaAngleDown, FaWallet } from "react-icons/fa6";

// Icons
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
						"flex items-center h-full text-primary",
						className,
					)} // Let's wait Kraken's magic
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
									className="w-full flex items-center justify-center gap-x-2 xl:gap-x-4 bg-primary text-black text-sm font-semibold py-2 px-4 lg:px-6 rounded-lg transition-all duration-300 ease-in-out border border-transparent hover:border-primary"
									onClick={openConnectModal}
									type="button"
								>
									<div className="text-2xl">
										<PiWallet />
									</div>
									<div className="hidden md:block">
										<span>Connect </span>
										<span className="hidden xl:inline">
											Wallet
										</span>
									</div>
								</button>
							);
						}

						// Wrong network
						if (chain.unsupported) {
							return (
								<button onClick={openChainModal} type="button">
									Wrong network
								</button>
							);
						}

						// Connected & no error
						return (
							<div className={`h-11 flex items-center gap-x-2`}>
								<button
									className="w-full h-full flex items-center gap-x-2 bg-grayBg px-2 lg:px-4 py-1 lg:py-2 rounded-lg border border-light/10 transition-all duration-300 ease-in-out hover:bg-primary/20 hover:border-primary"
									onClick={openChainModal}
									type="button"
								>
									{chain.hasIcon && (
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
									)}
									<div className="hidden lg:block w-16 truncate text-ellipsis">
										{chain.name}
									</div>
									<div className="hidden lg:block text-lg">
										<FaAngleDown />
									</div>
								</button>
								<button
									className="w-full h-full flex items-center gap-x-2 bg-grayBg px-2 lg:px-4 py-1 lg:py-2 rounded-lg border border-light/10 transition-all duration-300 ease-in-out hover:bg-primary/20 hover:border-primary"
									onClick={openAccountModal}
									type="button"
								>
									<div className="text-2xl">
										<FaWallet />
									</div>
									<div className="hidden lg:flex items-center gap-x-1">
										<div className="">
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
