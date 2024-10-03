"use client";

// Next
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Libs
import { defaultInputToken, defaultOutputToken } from "@/libs/defaultToken";
import { getTokenList } from "@/libs/tokens";

// Components
import SlippageSettingsModal from "@/components/modals/SlippageSettingsModal";

// Icons
import { FaArrowRotateLeft, FaGear } from "react-icons/fa6";
import SwapInputComponent from "@/components/input/SwapInputComponent";
import SwapBtn from "@/components/button/SwapBtn";
import { PiArrowsDownUpBold } from "react-icons/pi";

export default function SwapClient() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [tokens, setTokens] = useState<Token[]>([]);

	const [inputAmount, setInputAmount] = useState("");
	const [outputAmount, setOutputAmount] = useState("");

	const [inputToken, setInputToken] = useState<Token>(defaultInputToken);
	const [outputToken, setOutputToken] = useState<Token>(defaultOutputToken);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [isSlippage, setIsSlippage] = useState(false);

	useEffect(() => {
		async function fetchTokens() {
			try {
				const fetchedTokens = await getTokenList();
				setTokens([defaultInputToken, ...fetchedTokens]);
				setIsLoading(false);
			} catch (err) {
				console.error("Error fetching token list:", err);
				setError(
					"Failed to load tokens from comp. Please try again later.",
				);
				setIsLoading(false);
			}
		}

		fetchTokens();
	}, []);

	useEffect(() => {
		if (tokens.length > 0) {
			const inputCurrency = searchParams.get("inputCurrency");
			const outputCurrency = searchParams.get("outputCurrency");

			const foundInputToken =
				tokens.find((t) => t.address === inputCurrency) ||
				defaultInputToken;
			const foundOutputToken =
				tokens.find((t) => t.address === outputCurrency) ||
				defaultOutputToken;
			setInputToken(foundInputToken);
			setOutputToken(foundOutputToken);
		}
	}, [searchParams, tokens]);

	useEffect(() => {
		const params = new URLSearchParams();
		params.set("inputCurrency", inputToken.address);
		params.set("outputCurrency", outputToken.address);

		router.push(`/swap?${params.toString()}`);
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

	if (isLoading) {
		return <div>Loading tokens...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<Suspense>
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
		</Suspense>
	);
}
