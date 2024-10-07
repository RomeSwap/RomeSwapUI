import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const DEFAULT_LOGO_URI =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";

// check logoURI cos there is one token that has local relative path
function isValidLogoURI(uri: string | null | undefined): boolean {
  if (!uri) return false;
  return uri.startsWith("http://") || uri.startsWith("https://");
}

const parseToken = (token: JupiterToken): Token => ({
  address: token.address,
  symbol: token.symbol,
  name: token.name,
  decimals: token.decimals,
  logoURI: isValidLogoURI(token.logoURI) ? token.logoURI : DEFAULT_LOGO_URI,
});

export const jupiterTokenApi = createApi({
  reducerPath: "jupiterTokenApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://tokens.jup.ag/" }),
  endpoints: (builder) => ({
    getVerifiedTokens: builder.query<Token[], void>({
      query: () => "tokens?tags=verified",
      transformResponse: (result: { [address: string]: JupiterToken }) => {
        return Object.values(result).map(
          (token: JupiterToken): Token => parseToken(token)
        );
      },
    }),
    getTokenByAddress: builder.query<Token, string>({
      query: (address) => `token/${address}`,
      transformResponse: (rawResult: { result: { token: JupiterToken } }) => {
        return parseToken(rawResult.result.token);
      },
    }),
  }),
});

export const { useGetVerifiedTokensQuery, useGetTokenByAddressQuery } =
  jupiterTokenApi;
