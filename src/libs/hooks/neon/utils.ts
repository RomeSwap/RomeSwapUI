import { ethers } from "ethers";
import { Address } from "viem";
import { PublicKey, AccountMeta } from "@solana/web3.js";
import { neonProgram } from "./constants";

const publicKeyToBytes32 = (solAddress: string) => {
  return ethers.zeroPadValue(
    ethers.toBeHex(ethers.decodeBase58(solAddress)),
    32
  ) as Address;
};

const calculateTokenAccount = (tokenAddr: Address, userAddr: Address) => {
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

const prepareInstructionData = (data: Buffer): Address => {
  const packedInstructionData = ethers
    .solidityPacked(["bytes"], [data])
    .substring(2);

  return (ethers.zeroPadBytes(ethers.toBeHex(data.length), 8) +
    packedInstructionData) as Address;
};

const prepareInstructionAccounts = (accounts: AccountMeta[]): Address => {
  let encodeKeys = "";

  for (const account of accounts) {
    encodeKeys += ethers
      .solidityPacked(
        ["bytes32"],
        [publicKeyToBytes32(account.pubkey.toString())]
      )
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

export {
  calculateTokenAccount,
  prepareInstructionData,
  prepareInstructionAccounts,
  publicKeyToBytes32,
};
