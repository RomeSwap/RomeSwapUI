import { useQuery } from "@tanstack/react-query";
import { createJupiterApiClient } from "@jup-ag/api";
import { Address } from "viem";

type NotEVMAddress<T extends string> = T extends Address ? never : T;

interface QuoteArgs {
  inputMint: NotEVMAddress<string>;
  outputMint: NotEVMAddress<string>;
  amount: number;
  slippageBps: number;
  enabled: boolean;
}

export const jupiterApiClient = createJupiterApiClient();

export function useQuote({
  inputMint,
  outputMint,
  amount,
  slippage,
  enabled,
}: QuoteArgs) {
  return useQuery({
    refetchInterval: 3000,
    enabled,
    queryKey: ["jupiterQuote", inputMint, outputMint, amount, slippage],
    queryFn: () =>
      jupiterApiClient.quoteGet({
        inputMint,
        outputMint,
        amount: Number(amount),
        slippageBps: Math.round(slippage * 100),
        maxAccounts: 13,
        asLegacyTransaction: true,
      }),
  });
}
