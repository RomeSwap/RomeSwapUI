type Token = {
	address: string;
	symbol: string;
	name: string;
	decimals: number;
	logoURI: string;
};

interface TokenSelectorModalProps {
	tokens: Token[] | undefined;
	onClose: () => void;
	isLoading: boolean;
	onSelect: (token: Token) => void;
	defaultToken?: Token;
}
