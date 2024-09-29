"use client";

import React, { useState } from "react";

// Web3
import { useAccount } from "wagmi";

// Components
import CustomConnectWalletBtn from "@/components/button/CustomConnectWalletBtn";

// Libs
import { useTokenList } from "@/libs/useTokenList";
import SwapInputComponent from "@/components/input/SwapInputComponent";

const SwapInput = () => {
	// Modals
	const [isInputSelectorOpen, setIsInputSelectorOpen] = useState(false);
	const handleInputModal = () => {
		setIsInputSelectorOpen(!isInputSelectorOpen);
	};
	const [isOutputSelectorOpen, setIsOutputSelectorOpen] = useState(false);
	const handleOutputModal = () => {
		setIsOutputSelectorOpen(!isOutputSelectorOpen);
	};
	// Check if MM wallet is connected
	const { isConnected } = useAccount();

	const defaultInputToken = {
		chainId: 245022939,
		address: "0x57469B41E66B9b2Ad1750602451Dd3F1Fc10369B",
		decimals: 18,
		name: "Wrapped Neon",
		symbol: "wNEON",
		logoURI:
			"https://raw.githubusercontent.com/neonlabsorg/token-list/master/assets/wrapped-neon-logo.svg",
	};

	const defaultOutputToken = {
		chainId: 245022939,
		address_spl: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
		address: "0xf426d3A0EF80455dC9265b1c27C42B00336cF39F",
		decimals: 6,
		name: "USDT",
		symbol: "USDT",
		logoURI:
			"https://raw.githubusercontent.com/neonlabsorg/token-list/master/assets/tether-usdt-logo.svg",
	};

	const [inputAmount, setInputAmount] = useState("");
	const [outputAmount, setOutputAmount] = useState("");
	const [inputToken, setInputToken] = useState<Token>(defaultInputToken);
	const [outputToken, setOutputToken] = useState<Token>(defaultOutputToken);

	const { tokens, isLoading } = useTokenList();

	if (!isConnected) {
		return <p>Wallet not connected</p>;
	}

	const handleSwap = () => {
		// Implement swap logic here
		console.log("Swap", {
			inputAmount,
			outputAmount,
			inputToken,
			outputToken,
		});
	};
	return (
		<>
			{/* Output */}
			<SwapInputComponent
				amount={inputAmount}
				isLoading={isLoading}
				isSelectorOpen={isInputSelectorOpen}
				modalHandler={handleInputModal}
				onSelect={(token) => {
					setInputToken(token);
					setIsInputSelectorOpen(false);
				}}
				token={inputToken}
				tokens={tokens}
				defaultToken={defaultInputToken}
				onChange={(e) => setInputAmount(e.target.value)}
			/>
			{/* Output */}
			<SwapInputComponent
				amount={outputAmount}
				isLoading={isLoading}
				isSelectorOpen={isOutputSelectorOpen}
				modalHandler={handleOutputModal}
				onSelect={(token) => {
					setOutputToken(token);
					setIsOutputSelectorOpen(false);
				}}
				token={outputToken}
				tokens={tokens}
				defaultToken={defaultOutputToken}
				onChange={(e) => setOutputAmount(e.target.value)}
			/>

			{/* Swap button */}
			{isConnected ? (
				<button
					className="w-full text-center bg-primary font-semibold text-dark py-2 lg:py-3 rounded-lg"
					type="button"
					onClick={handleSwap}
				>
					Swap
				</button>
			) : (
				<CustomConnectWalletBtn />
			)}
		</>
	);
};

export default SwapInput;
