"use client";

// Next
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Libs
import { defaultInputToken, defaultOutputToken } from "@/libs/defaultToken";

// Components
import SlippageSettingsModal from "@/components/modals/SlippageSettingsModal";

// Icons
import { FaArrowRotateLeft, FaGear } from "react-icons/fa6";
import SwapInputComponent from "@/components/input/SwapInputComponent";
import SwapBtn from "@/components/button/SwapBtn";
import { PiArrowsDownUpBold } from "react-icons/pi";

export default function SwapClient({
	initialPair,
	initialTokens,
}: {
	initialPair: string;
	initialTokens: Token[];
}) {
	const router = useRouter();
	const [isSlippage, setIsSlippage] = useState(false);

	const [inputAmount, setInputAmount] = useState("");
	const [outputAmount, setOutputAmount] = useState("");

	const [inputToken, setInputToken] = useState<Token>(defaultInputToken);
	const [outputToken, setOutputToken] = useState<Token>(defaultOutputToken);

	const [tokens, setTokens] = useState<Token[]>(initialTokens);

	useEffect(() => {
		if (tokens && tokens.length > 0) {
			const [inputSymbol, outputSymbol] = initialPair.split("-");
			const foundInputToken =
				tokens.find((t) => t.symbol === inputSymbol) ||
				defaultInputToken;
			const foundOutputToken =
				tokens.find((t) => t.symbol === outputSymbol) ||
				defaultOutputToken;
			setInputToken(foundInputToken);
			setOutputToken(foundOutputToken);
		}
	}, [initialPair, tokens]);

	useEffect(() => {
		const inputSymbol = inputToken.symbol;
		const outputSymbol = outputToken.symbol;
		router.push(`/swap/${inputSymbol}-${outputSymbol}`);
	}, [inputToken, outputToken, router]);

	const handleSwap = () => {
		// Console log for now
		console.log("Swap", {
			inputAmount,
			outputAmount,
			inputToken,
			outputToken,
		});
	};

	const handleInputAmountChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setInputAmount(e.target.value);
		setOutputAmount(e.target.value); // same value as the input for now
	};

	const handleOutputAmountChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setOutputAmount(e.target.value);
		setInputAmount(e.target.value); // same value as the input for now
	};

	if (!tokens || tokens.length === 0) {
		return <div>Loading tokens...</div>;
	}

	return (
		<main>
			<div className="p-5 bg-grayBg rounded-2xl max-w-xs lg:max-w-2xl mx-auto flex flex-col ">
				<div className="w-full flex items-center justify-end gap-x-2 mb-4">
					<button
						type="button"
						className="flex items-center justify-center w-[32px] h-[32px] bg-primary text-grayBg rounded-full"
					>
						<span className="text-xl">
							<FaArrowRotateLeft />
						</span>
					</button>
					<button
						type="button"
						className=" text-4xl text-light"
						aria-label="Open slippage settings"
						onClick={() => setIsSlippage(true)}
					>
						<span className="text-[32px]">
							<FaGear />
						</span>
					</button>
					{isSlippage && (
						<SlippageSettingsModal
							onClose={() => setIsSlippage(false)}
						/>
					)}
				</div>
				<SwapInputComponent
					customBg="bg-dark"
					token={inputToken}
					tokens={tokens}
					amount={inputAmount}
					isLoading={false}
					onSelect={setInputToken}
					defaultToken={defaultInputToken}
					onChange={handleInputAmountChange}
				/>
				{/* Swap tokens button */}
				<div className="flex justify-end lg:justify-center items-center h-1.5 w-full relative">
					<button
						className="absolute -top-6 right-1.5 lg:right-auto flex items-center justify-center w-[51px] h-[51px] rounded-full border-4 border-grayBg bg-secondary text-light text-2xl"
						onClick={() => {
							const temp = inputToken;
							setInputToken(outputToken || defaultOutputToken);
							setOutputToken(temp);
							const tempAmount = inputAmount;
							setInputAmount(outputAmount);
							setOutputAmount(tempAmount);
						}}
						type="button"
						aria-label="Swap tokens"
					>
						<PiArrowsDownUpBold />
					</button>
				</div>
				{/* Output */}
				<SwapInputComponent
					customBg="bg-lightGray mb-[34px]"
					token={outputToken}
					tokens={tokens}
					amount={outputAmount}
					isLoading={false}
					onSelect={setOutputToken}
					defaultToken={defaultOutputToken}
					onChange={handleOutputAmountChange}
				/>
				<SwapBtn handleSwap={handleSwap} />
			</div>
		</main>
	);
}
