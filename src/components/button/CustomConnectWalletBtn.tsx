"use client";

// Rainbowkit
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

// Icons
import { PiWallet } from "react-icons/pi";

const CustomConnectWalletBtn = () => (
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
					className="" // Let's wait Kraken's magic
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
									className="flex items-center gap-x-2 xl:gap-x-4 bg-primary text-black text-sm font-semibold py-2 px-4 lg:px-6 rounded-full transition-all duration-300 ease-in-out border border-transparent hover:border-primary"
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
							<div className="flex items-center gap-x-2">
								<button
									className="flex items-center"
									onClick={openChainModal}
									type="button"
								>
									{chain.hasIcon && (
										<div
											style={{
												background:
													chain.iconBackground,
												width: 12,
												height: 12,
												borderRadius: 999,
												overflow: "hidden",
												marginRight: 4,
											}}
										>
											{chain.iconUrl && (
												<Image
													width={12}
													height={12}
													alt={
														chain.name ??
														"Chain icon"
													}
													src={chain.iconUrl}
												/>
											)}
										</div>
									)}
									{chain.name}
								</button>
								<button
									onClick={openAccountModal}
									type="button"
								>
									{account.displayName}
									{account.displayBalance
										? ` (${account.displayBalance})`
										: ""}
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
