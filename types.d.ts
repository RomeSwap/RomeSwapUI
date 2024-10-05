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
  setType: "input" | "output";
  onClose: () => void;
  isLoading: boolean;
  defaultToken?: Token;
}
