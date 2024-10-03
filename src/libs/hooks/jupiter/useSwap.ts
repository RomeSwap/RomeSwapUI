import { AccountMeta, Instruction, QuoteResponse } from "@jup-ag/api";
import { jupiterQuoteApi } from "./useQuote";
import { PublicKey } from "@solana/web3.js";
import { Address } from "viem";
import { BytesLike, ethers } from "ethers";
import { publicKeyToBytes32 } from "../neon/useGetSPL";
import { useQuery } from "@tanstack/react-query";

const contractPublicKey = new PublicKey(ethers.encodeBase58("0xda5edfafd40cac749b5b97cb3a5e73e0a67885610550451be73019fbab0cdb3f"));

const calculateTokenAccount = (
  tokenAddr: Address,
  userAddr: Address,
  neonEvmProgram: PublicKey,
) => {
  const neonAccountAddressBytes = Buffer.concat([
    Buffer.alloc(12),
    Buffer.from(userAddr ? userAddr.substring(2) : userAddr, "hex"),
  ]);
  const seed = [
    new Uint8Array([0x03]),
    new Uint8Array(Buffer.from("ContractData", "utf-8")),
    Buffer.from(tokenAddr.substring(2), "hex"),
    Buffer.from(neonAccountAddressBytes.toString(), "hex"),
  ];

  const [address] = PublicKey.findProgramAddressSync(seed, neonEvmProgram);

  return address.toBase58();
};

export const useSwapInstructions = (
  quote: QuoteResponse,
  tokenAddr: Address,
  userAddr: Address,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: [quote, tokenAddr, userAddr],
    enabled,
    queryFn: () =>
      jupiterQuoteApi
        .swapInstructionsPost({
          swapRequest: {
            userPublicKey: contractPublicKey.toBase58(),
            quoteResponse: quote,
            wrapAndUnwrapSol: false,
            destinationTokenAccount: calculateTokenAccount(
              tokenAddr,
              userAddr,
              contractPublicKey,
            ),
          },
        })
        .then((x) => x.swapInstruction),
  });
};

export const prepareInstructionData = (data: BytesLike): Address => {
  const packedInstructionData = ethers
    .solidityPacked(["bytes"], [data])
    .substring(2);
  console.log(packedInstructionData, "packedInstructionData");

  return (
    "0x" +
    ethers.zeroPadBytes(ethers.toBeHex(data.length), 8).substring(2) +
    packedInstructionData
  ) as Address;
};

export const prepareInstructionAccounts = (
  accounts: AccountMeta[]
): Address => {
  let encodeKeys = "";
  for (let i = 0, len = accounts.length; i < len; ++i) {
      encodeKeys += ethers
        .solidityPacked(
          ["bytes32"],
          [publicKeyToBytes32(accounts[i].pubkey.toString())],
        )
        .substring(2);
      encodeKeys += ethers
        .solidityPacked(["bool"], [accounts[i].isSigner])
        .substring(2);
      encodeKeys += ethers
        .solidityPacked(["bool"], [accounts[i].isWritable])
        .substring(2);
  }

  return (
    "0x" +
    ethers
      .zeroPadBytes(ethers.toBeHex(accounts.length), 8)
      .substring(2) +
    encodeKeys
  ) as Address;
};
