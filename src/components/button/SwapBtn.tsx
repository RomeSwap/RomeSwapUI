"use client";

import { useAccount } from "wagmi";
import CustomConnectWalletBtn from "../button/CustomConnectWalletBtn";
import clsx from "clsx";

const SwapBtn = ({ handleSwap }: { handleSwap: () => void }) => {
	const { isConnected } = useAccount();

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
