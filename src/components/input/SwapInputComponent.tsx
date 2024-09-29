import { NextPage } from "next";
import Image from "next/image";

// Components
import TokenSelectorModal from "@/components/modals/TokenSelectorModal";

// React icons
import { FaAngleDown } from "react-icons/fa6";

interface Props {
	modalHandler: () => void;
	isSelectorOpen: boolean;
	token: Token;
	tokens: Token[] | undefined;
	amount: string;
	defaultToken?: Token;
	isLoading: boolean;
	onSelect: (token: Token) => void;
	onChange: (e: unknown) => void;
}

const SwapInputComponent: NextPage<Props> = ({
	modalHandler,
	isSelectorOpen,
	onChange,
	token,
	tokens,
	amount,
	isLoading,
	defaultToken,
	onSelect,
}) => {
	return (
		<div className="w-full flex flex-col bg-dark p-4 rounded-lg">
			<div className="flex flex-col gap-y-2">
				<div className="flex items-center justify-between">
					<button
						className="flex items-center gap-x-2 bg-grayBg px-3 py-1.5 rounded-md"
						type="button"
						onClick={modalHandler}
					>
						<div className="">
							<Image
								src={token.logoURI!}
								width={28}
								height={28}
								alt={token.symbol}
							/>
						</div>
						<div className="">{token.symbol}</div>
						<div className="">
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
					/>
					<div className="text-grayText text-xs text-end ">
						~XXUSD
					</div>
				</div>
			</div>
			{isSelectorOpen && (
				<TokenSelectorModal
					defaultToken={defaultToken}
					onClose={modalHandler}
					tokens={tokens}
					isLoading={isLoading}
					onSelect={onSelect}
				/>
			)}
		</div>
	);
};

export default SwapInputComponent;
