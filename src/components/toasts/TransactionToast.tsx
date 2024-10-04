import React from "react";

import clsx from "clsx";
import { GoCheckCircle, GoXCircle } from "react-icons/go";

interface ToastProps {
	status: boolean;
	tx?: string;
}

const TransactionToast: React.FC<ToastProps> = ({
	status,
	tx = "0x0000000000000000000000000000000",
}) => {
	return (
		<div
			className={
				(clsx("flex items-center border p-4 rounded-md"),
				status
					? "bg-primary/10 border-primary"
					: "bg-error/10 border-error")
			}
		>
			<div className="text-2xl">
				{status ? (
					<div className="text-primary">
						<GoCheckCircle />
					</div>
				) : (
					<div className="text-error">
						<GoXCircle />
					</div>
				)}
			</div>
			<div className="text-sm">{tx}</div>
		</div>
	);
};

export default TransactionToast;
