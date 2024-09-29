"use client";

// React
import { useEffect, useState } from "react";

// Next
import Image from "next/image";

// Libs
import walletTruncatizer from "@/libs/walletTruncatizer";

// Icons
import { GoXCircleFill } from "react-icons/go";
import { IoSearchSharp } from "react-icons/io5";

const TokenSelectorModal = ({
	tokens,
	onSelect,
	onClose,
	isLoading,
	defaultToken,
}: TokenSelectorModalProps) => {
	const [search, setSearch] = useState("");
	const [allTokens, setAllTokens] = useState<Token[]>([]);

	useEffect(() => {
		if (tokens) {
			if (defaultToken) {
				setAllTokens([
					defaultToken,
					...tokens.filter((t) => t.address !== defaultToken.address),
				]);
			} else {
				setAllTokens(tokens);
			}
		}
	}, [tokens, defaultToken]);

	const filteredTokens = allTokens.filter(
		(token) =>
			token.name.toLowerCase().includes(search.toLowerCase()) ||
			token.symbol.toLowerCase().includes(search.toLowerCase()),
	);
	return (
		<div className="absolute z-50 top-0 left-0 w-screen h-screen flex items-center justify-center">
			<div
				className="w-full h-full bg-transparent backdrop-blur-lg"
				onClick={onClose}
			></div>
			<div className="absolute bg-grayBg rounded-lg w-[90%] lg:w-[641px]">
				<div className="flex items-center justify-between gap-x-5 p-4">
					<div className="flex items-center gap-x-4">
						<div className="text-3xl lg:text-4xl">
							<IoSearchSharp />
						</div>
						<input
							className="bg-grayBg outline-none p-2"
							type="search"
							value={search}
							placeholder="Search token"
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<button
						className="text-3xl lg:text-4xl text-grayText"
						onClick={onClose}
					>
						<GoXCircleFill />
					</button>
				</div>
				<div className="overflow-y-auto h-[80vh]">
					{isLoading ? (
						<div className="text-center">Loading tokens...</div>
					) : allTokens.length > 0 ? (
						filteredTokens.map((token, idx) => (
							<button
								key={idx}
								className="flex items-center justify-between w-full text-left p-2 hover:bg-grayText/30 rounded"
								onClick={() => onSelect(token)}
							>
								<div className="flex items-center gap-x-2">
									<div className="ml-2 w-11 h-11">
										<Image
											className="w-full h-full"
											src={token.logoURI!}
											width={46}
											height={46}
											alt={token.name}
										/>
									</div>
									<div className="flex flex-col ">
										<div className="font-bold">
											{token.symbol}
										</div>
										<div className="text-xs text-gray-500">
											{walletTruncatizer(token.address)}
										</div>
										<div className="text-sm text-gray-500">
											{token.name}
										</div>
									</div>
								</div>
							</button>
						))
					) : (
						<div className="text-center">No tokens available</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TokenSelectorModal;
