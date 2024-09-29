import { Metadata } from "next";
import { FaArrowRotateLeft, FaGear } from "react-icons/fa6";
import SwapInput from "./SwapInput";

export const metadata: Metadata = {
	title: "Swap | LoremSwap",
};

export default function Home() {
	return (
		<main>
			<div className="p-5 bg-grayBg rounded-2xl max-w-xs lg:max-w-2xl mx-auto flex flex-col gap-y-4">
				<div className="w-full flex items-center justify-end gap-x-2">
					<button
						type="button"
						className="flex items-center justify-center w-[32px] h-[32px] bg-primary text-grayBg rounded-full"
					>
						<span className="text-xl">
							<FaArrowRotateLeft />
						</span>
					</button>
					<button type="button" className=" text-4xl text-light">
						<span className="text-[32px]">
							<FaGear />
						</span>
					</button>
				</div>
				<SwapInput />
			</div>
		</main>
	);
}
