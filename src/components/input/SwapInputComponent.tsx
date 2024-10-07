"use client";

import Image from "next/image";
import TokenSelectorModal from "@/components/modals/TokenSelectorModal";
import { FaAngleDown } from "react-icons/fa6";
import { useState } from "react";
import clsx from "clsx";
import { useAppDispatch } from "@/libs/hooks/redux/redux";
import { setInputTokenAmount } from "@/libs/features/swap/swapSlice";
import { nexa } from "@/app/fonts/fonts";

interface SwapInputComponentProps {
	setType: "input" | "output";
	token: Token;
	amount?: number;
	defaultToken?: Token;
	isLoading: boolean;
	onSelect: (token: Token) => void;
	customBg: string;
	readOnly?: boolean;
	balance?: number;
}

const DEFAULT_LOGO_URI =
	"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";

const SwapInputComponent = ({
	token,
	amount,
	isLoading,
	defaultToken,
	customBg,
	readOnly,
	balance,
	setType,
}: SwapInputComponentProps) => {
	const [imageError, setImageError] = useState(false);
	const [isSelectorOpen, setIsSelectorOpen] = useState(false);
	const dispatch = useAppDispatch();

	const toggleSelector = () => setIsSelectorOpen(!isSelectorOpen);

	const handleAmountChange = (e: any) => {
		if (setType == "input") {
			dispatch(setInputTokenAmount(Number(e.target.value)));
		}
	};

	return (
		<div
			className={clsx(
				"w-full flex flex-col p-4 py-6 lg:py-4 rounded-lg",
				customBg,
			)}
		>
			<div className="flex flex-col gap-y-2">
				<div className="flex items-center justify-between">
					<button
						className="flex items-center justify-between gap-x-2 bg-grayBg px-3 py-1.5 rounded-md h-[35px] max-w-md"
						type="button"
						onClick={toggleSelector}
					>
						<div className="w-full h-full flex items-center gap-x-2">
							{token.logoURI && (
								<Image
									className="w-[21px] h-[21px] rounded-full"
									src={
										imageError || !token.logoURI
											? DEFAULT_LOGO_URI
											: token.logoURI
									}
									// src={token.logoURI}
									width={21}
									height={21}
									alt={`${token.symbol} logo`}
									onError={() => setImageError(true)}
								/>
							)}
							<div className="">{token.symbol}</div>
						</div>
						<div className="" aria-hidden="true">
							<FaAngleDown />
						</div>
					</button>
					<div className="text-xs text-grayText">
						<div className="">Balance</div>
						<div className="">{balance ?? "loading..."}</div>
						<button type="button">MAX</button>
					</div>
				</div>
				<div
					className={clsx(
						"flex items-center justify-between font-thin",
						nexa.className,
					)}
				>
					<input
						type="text"
						className="p-2 w-full bg-transparent text-xl lg:text-2xl placeholder:text-light/30 outline-none appearance-none"
						placeholder="0.00"
						defaultValue={amount}
						onChange={handleAmountChange}
						aria-label={`Enter amount of ${token.symbol}`}
						readOnly={readOnly ?? false}
					/>
					<div className="text-grayText text-xs text-end ">
						~XXUSD
					</div>
				</div>
			</div>
			{isSelectorOpen && (
				<TokenSelectorModal
					setType={setType}
					defaultToken={defaultToken}
					onClose={toggleSelector}
					isLoading={isLoading}
				/>
			)}
		</div>
	);
};

export default SwapInputComponent;
