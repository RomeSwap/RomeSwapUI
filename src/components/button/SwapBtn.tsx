"use client";

// Web3
import { useAccount } from "wagmi";

// Comps
import CustomConnectWalletBtn from "../button/CustomConnectWalletBtn";

import clsx from "clsx";

const SwapBtn = () => {
	const { isConnected } = useAccount();

	const handleSwap = () => {
		// Simon's
		console.log("Swap", {});
	};
	if (!isConnected) {
		return <CustomConnectWalletBtn className={clsx("w-full")} />;
	}
	return (
		<button
			className="w-full text-center bg-primary font-semibold text-dark py-2 lg:py-3 rounded-lg"
			type="button"
			onClick={handleSwap}
		>
			Swap
		</button>
	);
};

export default SwapBtn;
