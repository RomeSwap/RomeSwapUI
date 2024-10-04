import { NextPage } from "next";
import Image from "next/image";
import { GoArrowDown, GoXCircleFill } from "react-icons/go";

interface Props {
	onClose: () => void;
	inAmount: number;
	outAmount: number;
	inputToken: string;
	outputToken: string;
	inURI: string;
	outURI: string;
	isSlippage?: number;
	outputSymbol: string;
	inputSymbol: string;
	price: number | null;
	priceImpact?: number; // Placeholder
	tradingFee?: number; // Placeholder
}

const ConfirmSwap: NextPage<Props> = ({
	onClose,
	inAmount,
	outAmount,
	inputToken,
	outputToken,
	inURI,
	outURI,
	inputSymbol,
	outputSymbol,
	price,
	isSlippage = 0.5, //set Later from the slippage
	priceImpact = 1, // placeholder
	tradingFee = 0.0002, // placheolder
}) => {
	const handleSwap = () => {
		// Console log for now
		console.log("Swap", {
			inAmount,
			outAmount,
			inputToken,
			outputToken,
		});
		onClose();
	};
	return (
		<div>
			<div className="absolute z-50 top-0 left-0 w-screen h-screen flex items-center justify-center">
				<div
					className="w-full h-full bg-transparent backdrop-blur-lg"
					onClick={onClose}
				></div>
				<div className="absolute bg-grayBg rounded-lg w-[90%] md:max-w-md lg:w-[641px] flex flex-col items-center overflow-hidden">
					{/* Head */}
					<div className="flex items-center justify-between w-full p-4 bg-secondary/40">
						<div className="font-semibold">Confirm Swap</div>
						<button
							className="text-3xl lg:text-4xl text-grayText"
							onClick={onClose}
							aria-label="Close token selector"
							type="button"
						>
							<GoXCircleFill />
						</button>
					</div>
					{/* Body */}
					<div className="flex flex-col items-center w-full p-4 gap-y-5">
						<div className=" relative flex flex-col items-center w-full gap-y-4">
							{/* Input */}
							<div className="flex items-center justify-between w-full">
								<div className="flex items-center gap-x-1">
									<Image
										className="rounded-full"
										src={inURI}
										width={32}
										height={32}
										alt={inputToken}
									/>
									<div>{inputToken}</div>
								</div>
								<div>{inAmount}</div>
							</div>
							<div className="absolute w-full h-0 top-[50%] flex items-center justify-center">
								<div className="text-2xl flex items-center justify-center animate-bounce">
									<GoArrowDown />
									<GoArrowDown />
								</div>
							</div>
							{/* Output */}
							<div className="flex items-center justify-between w-full">
								<div className="flex items-center gap-x-1">
									<Image
										className="rounded-full"
										src={outURI}
										width={32}
										height={32}
										alt={outputToken}
									/>
									<div>{outputToken}</div>
								</div>
								<div>{outAmount}</div>
							</div>
						</div>
						<div className="flex flex-col items-center gap-y-2 justify-between w-full text-sm">
							<div className="w-full flex items-center justify-between">
								<div className="text-primary">
									Slippage tolerance
								</div>
								<div className="">{isSlippage}%</div>
							</div>
							<p className="text-justify text-sm">
								Output is estimated. You will receive at least{" "}
								<span className="font-semibold text-secondary">
									{outAmount.toFixed(2)}
								</span>{" "}
								{outputSymbol} or the transaction will revert.
							</p>
						</div>
						<div className="w-full flex flex-col bg-background text-grayText text-sm rounded-md p-4 gap-y-2">
							<div className="flex items-center justify-between">
								<div>Price</div>
								<div>
									{price} {inputSymbol}/{outputSymbol}
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div>Minimum received</div>
								<div>{outAmount.toFixed(2)}</div>
							</div>
							<div className="flex items-center justify-between">
								<div>Price Impact</div>
								<div className="text-primary">
									{priceImpact}%
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div>Trading fee</div>
								<div>{tradingFee}SOL</div>
							</div>
						</div>
						<button
							className="bg-primary w-full py-2 text-background rounded-md font-semibold hover:bg-primary/75"
							onClick={handleSwap}
							aria-label="Confirm Swap"
							type="button"
						>
							Confirm Swap
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConfirmSwap;
