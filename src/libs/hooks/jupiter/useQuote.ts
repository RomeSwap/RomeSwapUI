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
  slippageBps,
  enabled,
}: QuoteArgs) {
  return useQuery({
    refetchInterval: 5000,
    enabled,
    queryKey: ["jupiterQuote", inputMint, outputMint, amount, slippageBps],
    queryFn: () =>
      jupiterApiClient.quoteGet({
        inputMint,
        outputMint,
        amount,
        slippageBps,
        maxAccounts: 13,
        asLegacyTransaction: true,
      }),
  });
}
