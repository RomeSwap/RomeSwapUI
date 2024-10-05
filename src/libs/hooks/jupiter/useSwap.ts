import { QuoteResponse } from "@jup-ag/api";
import { jupiterApiClient } from "./useQuote";
import { Address } from "viem";
import { contractPublicKey } from "../neon/constants";
import {
  calculateTokenAccount,
  prepareInstructionAccounts,
  prepareInstructionData,
  publicKeyToBytes32,
} from "../neon/utils";
import { Transaction } from "@solana/web3.js";

export const fetchSwapInstruction = async (
  quote: QuoteResponse,
  outputTokenAddr: Address,
  userAddr: Address
) =>
  jupiterApiClient
    .swapPost({
      swapRequest: {
        userPublicKey: contractPublicKey.toBase58(),
        quoteResponse: quote,
        wrapAndUnwrapSol: false,
        asLegacyTransaction: true,
        destinationTokenAccount: calculateTokenAccount(
          outputTokenAddr,
          userAddr
        ),
      },
    })
    .then((x) => x.swapTransaction)
    .then((x) => {
      const swapTxBuf = Buffer.from(x, "base64");
      const swapTx = Transaction.from(swapTxBuf);
      const swapInstruction =
        swapTx.instructions[swapTx.instructions.length - 1];

      const programId = publicKeyToBytes32(
        swapInstruction.programId.toBase58()
      );
      const data = prepareInstructionData(swapInstruction.data);
      const accounts = prepareInstructionAccounts(swapInstruction.keys);

      return {
        programId,
        data,
        accounts,
      };
    });
