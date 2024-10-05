import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

const DEFAULT_LOGO_URI =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";

// check logoURI cos there is one token that has local relative path
function isValidLogoURI(uri: string | null | undefined): boolean {
  if (!uri) return false;
  return uri.startsWith("http://") || uri.startsWith("https://");
}

export const jupiterTokenApi = createApi({
    reducerPath: "jupiterTokenApi",
    baseQuery: fetchBaseQuery({baseUrl: "https://tokens.jup.ag/"}),
    endpoints: (builder) => ({
        getVerifiedTokens: builder.query<Token[], null>({
            query: () => "tokens?tags=verified",
            transformResponse: (rawResult: {result: {tokens: { [address: string]: JupiterToken }}}) => {
            const data =  rawResult.result.tokens

              return Object.values(data).map(
                (token: JupiterToken): Token => ({
                  address: token.address,
                  symbol: token.symbol,
                  name: token.name,
                  decimals: token.decimals,
                  logoURI: isValidLogoURI(token.logoURI)
                    ? token.logoURI
                    : DEFAULT_LOGO_URI,
                })
              );
            },
        })
    })
})

export const {useGetVerifiedTokensQuery} = jupiterTokenApi
