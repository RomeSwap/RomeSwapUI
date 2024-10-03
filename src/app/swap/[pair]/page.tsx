import SwapClient from "./swap-client";

// Libs
import { getTokenList } from "@/libs/tokens";

export default async function SwapPage({
	params,
}: {
	params: { pair: string };
}) {
	const tokens = await getTokenList();
	console.log(tokens);
	if (!tokens || tokens.length === 0) {
		return <div>Error loading tokens. Please try again later.</div>;
	}
	return <SwapClient initialPair={params.pair} initialTokens={tokens} />;
}
