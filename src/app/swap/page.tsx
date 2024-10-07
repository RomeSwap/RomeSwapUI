"use client";

import { Suspense } from "react";
import Image from "next/image";
import SwapClient from "./swap-client";
import { Toaster } from "react-hot-toast";

export default function SwapPage() {
	return (
		<Suspense>
			<div className="h-screen w-full flex flex-col items-center justify-center">
				<SwapClient />
				<div className="absolute -left-56 hidden lg:block">
					<Image
						src="/colosseum.png"
						width={700}
						height={700}
						alt="Rome Banner"
					/>
				</div>
				<Toaster position="bottom-right" />
			</div>
		</Suspense>
	);
}
