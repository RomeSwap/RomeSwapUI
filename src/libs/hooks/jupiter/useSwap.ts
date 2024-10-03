import {  QuoteResponse } from "@jup-ag/api";
import { jupiterQuoteApi } from "./useQuote";
import { PublicKey, AccountMeta } from "@solana/web3.js";
import { Address } from "viem";
import { ethers } from "ethers";
import { publicKeyToBytes32 } from "../neon/useGetSPL";
import { useQuery } from "@tanstack/react-query";

export const ICSFlowMainnet = "0x16906ADb704590F94F8a32ff0a690306A34A0bfC";

export const contractPublicKey = new PublicKey(
  ethers.encodeBase58(
    "0xda5edfafd40cac749b5b97cb3a5e73e0a67885610550451be73019fbab0cdb3f",
  ),
);

const neonProgram = new PublicKey(
    ethers.encodeBase58("0x058bf1f0ab8c7508d14efe57c15e86b22cf8246ca415ca5c4f69b3529a0f073b")
);

const calculateTokenAccount = (
  tokenAddr: Address,
  userAddr: Address,
) => {
  const neonAccountAddressBytes = Buffer.concat([
    Buffer.alloc(12),
    Buffer.from(userAddr.substring(2), "hex"),
  ]);
  const seed = [
    new Uint8Array([0x03]),
    new Uint8Array(Buffer.from("ContractData", "utf-8")),
    Buffer.from(tokenAddr.substring(2), "hex"),
    neonAccountAddressBytes,
  ];

  const [address] = PublicKey.findProgramAddressSync(seed, neonProgram);

  return address.toBase58();
};

export const useSwapInstructions = (
  quote: QuoteResponse,
  outputTokenAddr: Address,
  userAddr: Address,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: [quote, outputTokenAddr, userAddr],
    enabled,
    queryFn: () =>
      jupiterQuoteApi
        .swapPost({
          swapRequest: {
            userPublicKey: contractPublicKey.toBase58(),
            quoteResponse: quote,
            wrapAndUnwrapSol: false,
            asLegacyTransaction: true,
            destinationTokenAccount: calculateTokenAccount(
              outputTokenAddr,
              userAddr,
            ),
          },
        })
        .then((x) => x.swapTransaction),
  });
};

export const prepareInstructionData = (data: Buffer): Address => {
  const packedInstructionData = ethers
    .solidityPacked(["bytes"], [data])
    .substring(2);

  return (ethers.zeroPadBytes(ethers.toBeHex(data.length), 8) +
    packedInstructionData) as Address;
};

export const prepareInstructionAccounts = (
  accounts: AccountMeta[],
): Address => {
  let encodeKeys = "";

  for (const account of accounts) {
    encodeKeys += ethers
      .solidityPacked(["bytes32"], [publicKeyToBytes32(account.pubkey.toString())])
      .substring(2);
    encodeKeys += ethers
      .solidityPacked(["bool"], [account.isSigner])
      .substring(2);
    encodeKeys += ethers
      .solidityPacked(["bool"], [account.isWritable])
      .substring(2);
  }

  return (ethers.zeroPadBytes(ethers.toBeHex(accounts.length), 8) +
    encodeKeys) as Address;
};
