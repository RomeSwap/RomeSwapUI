interface JupiterToken {
	chainId: number;
	address: string;
    address_spl: string;
	symbol: string;
	name: string;
	decimals: number;
	logoURI: string;
}

interface JupiterTokenList {
	name: string;
	logoURI: string;
	keywords: string[];
	tags: Record<string, { name: string; description: string }>;
	timestamp: string;
	tokens: JupiterToken[];
}

interface Token {
	address: string;
	symbol: string;
	name: string;
	decimals: number;
	logoURI: string;
}

interface TokenSelectorModalProps {
	tokens: Token[] | undefined;
	onClose: () => void;
	isLoading: boolean;
	onSelect: (token: Token) => void;
	defaultToken?: Token;
}
