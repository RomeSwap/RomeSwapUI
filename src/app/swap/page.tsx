"use client";
import { Suspense } from "react";
import SwapClient from "./swap-client";

export default function SwapPage() {
	return (
		<Suspense>
			<SwapClient />
		</Suspense>
	);
}
