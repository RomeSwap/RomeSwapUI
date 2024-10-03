import { useQuery } from "@tanstack/react-query";

const JUPITER_VERIFIED_TOKEN_LIST_URL =
  "https://tokens.jup.ag/tokens?tags=verified";

const DEFAULT_LOGO_URI =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";

// check logoURI cos there is one token that has local relative path
function isValidLogoURI(uri: string | null | undefined): boolean {
  if (!uri) return false;
  return uri.startsWith("http://") || uri.startsWith("https://");
}

export const useTokenList = () =>
  useQuery({
    queryKey: ["tokenList"],
    refetchInterval: 30000,
    queryFn: () =>
      fetch(JUPITER_VERIFIED_TOKEN_LIST_URL)
        .then((x) => x.json())
        .then((res) => {
          const data = res as { [address: string]: JupiterToken };

          return Object.values(data).map(
            (token: JupiterToken): Token => ({
              address: token.address,
              symbol: token.symbol,
              name: token.name,
              decimals: token.decimals,
              logoURI: isValidLogoURI(token.logoURI)
                ? token.logoURI
                : DEFAULT_LOGO_URI,
            }),
          );
        }),
  });
