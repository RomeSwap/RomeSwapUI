"use client";

import { Suspense } from "react";
import Image from "next/image";
import SwapClient from "./swap-client";
import { Toaster } from "react-hot-toast";

export default function SwapPage() {
	return (
		<Suspense>
			<div className="h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center">
				<div className="absolute z-20">
					<SwapClient />
				</div>
				<div className="absolute -left-56 hidden lg:block">
					<Image
						src="/colosseum.png"
						width={1200}
						height={1200}
						alt="Rome Banner"
					/>
				</div>
				<Toaster position="bottom-right" />
			</div>
		</Suspense>
	);
}
