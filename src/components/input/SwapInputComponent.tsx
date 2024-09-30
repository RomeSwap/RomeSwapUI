"use client";

import Image from "next/image";

// Components
import TokenSelectorModal from "@/components/modals/TokenSelectorModal";

// React icons
import { FaAngleDown } from "react-icons/fa6";
import { useState } from "react";
import clsx from "clsx";

interface SwapInputComponentProps {
	token: Token;
	tokens: Token[] | undefined;
	amount: string;
	defaultToken?: Token;
	isLoading: boolean;
	onSelect: (token: Token) => void;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	customBg: string;
}

const SwapInputComponent = ({
	onChange,
	token,
	tokens,
	amount,
	isLoading,
	defaultToken,
	onSelect,
	customBg,
}: SwapInputComponentProps) => {
	const [isSelectorOpen, setIsSelectorOpen] = useState(false);

	const toggleSelector = () => setIsSelectorOpen(!isSelectorOpen);

	return (
		<div className={clsx("w-full flex flex-col p-4 rounded-lg", customBg)}>
			<div className="flex flex-col gap-y-2">
				<div className="flex items-center justify-between">
					<button
						className="flex items-center gap-x-2 bg-grayBg px-3 py-1.5 rounded-md"
						type="button"
						onClick={toggleSelector}
					>
						{token.logoURI && (
							<Image
								src={token.logoURI}
								width={28}
								height={28}
								alt={`${token.symbol} logo`}
							/>
						)}
						<div className="">{token.symbol}</div>
						<div className="" aria-hidden="true">
							<FaAngleDown />
						</div>
					</button>
					<div className="text-xs text-grayText">
						<div className="">Balance</div>
						<div className="">
							{/* {balanceData?.value} {balanceData?.symbol} */}
						</div>
						<button type="button">MAX</button>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<input
						type="number"
						min={0}
						className="p-2 w-full bg-transparent text-2xl placeholder:text-light/30 outline-none appearance-none"
						placeholder="0.00"
						value={amount}
						onChange={onChange}
						aria-label={`Enter amount of ${token.symbol}`}
					/>
					<div className="text-grayText text-xs text-end ">
						~XXUSD
					</div>
				</div>
			</div>
			{isSelectorOpen && (
				<TokenSelectorModal
					defaultToken={defaultToken}
					onClose={toggleSelector}
					tokens={tokens || []}
					isLoading={isLoading}
					onSelect={(selectedToken) => {
						onSelect(selectedToken);
						toggleSelector();
					}}
				/>
			)}
		</div>
	);
};

export default SwapInputComponent;
