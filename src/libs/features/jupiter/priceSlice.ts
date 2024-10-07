import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface JupiterTokenPrice {
  data: Record<
    string,
    {
      id: string;
      price: number;
    }
  >;
}

export const jupiterPriceApi = createApi({
  reducerPath: "jupiterPriceApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://price.jup.ag/v6/" }),
  endpoints: (builder) => ({
    getTokenPrice: builder.query<JupiterTokenPrice, string>({
      query: (solanaAddress: string) => `price?ids=${solanaAddress}`,
    }),
  }),
});

export const { useGetTokenPriceQuery } = jupiterPriceApi;
