"use client";

// Web3
import { useAccount } from "wagmi";

// Components
import CustomConnectWalletBtn from "../button/CustomConnectWalletBtn";

import clsx from "clsx";

const SwapBtn = ({
	confirmSwapModal,
	isDisabled,
}: {
	confirmSwapModal: () => void;
	isDisabled: boolean;
}) => {
	const { isConnected } = useAccount();

	if (!isConnected) {
		return <CustomConnectWalletBtn className={clsx("w-full")} />;
	}

	return (
		<button
			className={clsx(
				"w-full text-center bg-primary font-semibold text-dark py-2 lg:py-3 rounded-lg",
				isDisabled ? " cursor-not-allowed" : "",
			)}
			type="button"
			onClick={confirmSwapModal}
			disabled={isDisabled}
		>
			Swap
		</button>
	);
};

export default SwapBtn;
