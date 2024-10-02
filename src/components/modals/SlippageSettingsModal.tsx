import clsx from "clsx";
import React, { useEffect } from "react";

import { useState } from "react";

// Icons
import { GoXCircleFill } from "react-icons/go";
import { IoWarning } from "react-icons/io5";

interface SlippageSettingsProps {
	onClose: () => void;
}
const SlippageSettingsModal: React.FC<SlippageSettingsProps> = ({
	onClose,
}) => {
	const slippagePercentages = [0.1, 0.5, 1];
	const maxSlippageAllowed = 49;
	const [slippage, setSlippage] = useState(1);
	const [warningMsg, setWarningMsg] = useState<string | null>(null);

	const isSlippageActive = (percentage: number) => {
		if (slippage === percentage) {
			return true;
		}
	};

	useEffect(() => {
		if (slippage <= 0.1) {
			setWarningMsg("Your transaction may fall");
		} else if (slippage > maxSlippageAllowed) {
			setWarningMsg(
				"Your transaction may be frontrun and result in an unfavorable trade",
			);
		} else {
			setWarningMsg(null);
		}
	}, [slippage]);

	return (
		<div className="z-50 absolute top-0 right-0 w-full h-full flex items-center justify-center">
			<div
				className="w-full h-full bg-transparent backdrop-blur-lg"
				onClick={onClose}
			></div>
			<div className="absolute bg-grayBg rounded-lg w-[90%] lg:w-[641px]">
				<div className="w-full flex flex-col gap-y-3 items-center justify-between gap-x-5 py-4 px-6">
					{/* Modal title */}
					<div className="w-full flex items-center justify-between">
						<div className="text-lg lg:text-2xl font-semibold lg:font-bold">
							Swap slippage tolerance
						</div>
						<button
							className="text-xl lg:text-4xl text-grayText"
							onClick={onClose}
							aria-label="Close token selector"
							type="button"
						>
							<GoXCircleFill />
						</button>
					</div>
					{/* Modal slippages */}
					<div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-y-2">
						<div className="w-full flex items-center justify-between md:justify-center gap-x-2">
							{slippagePercentages.map((slp) => {
								return (
									<button
										key={slp}
										onClick={() => setSlippage(slp)}
										className={clsx(
											"w-16 bg-grayText/5 py-1 rounded-md border transition-all duration-300 ease-in-out",
											isSlippageActive(slp)
												? "border-primary text-primary"
												: "border-transparent",
										)}
										type="button"
										aria-label={`Set slippage to ${slp}%`}
									>
										{slp}%
									</button>
								);
							})}
						</div>
						<div className="flex items-center justify-between gap-x-2">
							<div className="">Custom</div>
							<div className="flex items-center">
								<input
									className="bg-background w-16 text-end py-1 rounded-md outline-none border border-transparent focus:border-primary pr-1"
									type="number"
									max={maxSlippageAllowed}
									min={0}
									value={slippage}
									onChange={(e) =>
										setSlippage(parseFloat(e.target.value))
									}
									placeholder={slippage as unknown as string}
								/>
								<div>%</div>
							</div>
						</div>
					</div>
					{warningMsg && (
						<div className="w-full flex items-center gap-x-2 bg-yellow-300/10 text-yellow-500 p-2 rounded-lg">
							<div className="text-2xl">
								<IoWarning />
							</div>
							<div className="">{warningMsg}</div>
						</div>
					)}
					{/* Save  */}
					<button
						className="w-full bg-primary rounded-md py-2 text-background font-semibold"
						type="button"
						disabled={slippage === null ? true : false}
						onClick={onClose} // For now just close the modal, will be changed to really change the slippage
						aria-label={`Save slippage to ${slippage}%`}
					>
						{warningMsg ? "Save Anyway" : "Save Slippage"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default SlippageSettingsModal;
