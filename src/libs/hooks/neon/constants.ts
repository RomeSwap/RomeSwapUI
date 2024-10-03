import { PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";

// address of the spl factory on neon, used to create missing ATA contracts or lookup
// the respective erc20 token for a given solana address
const ERC20ForSplFactoryAddress = "0x6B226a13F5FE3A5cC488084C08bB905533804720";

// address of the smart contract we use on NeonEVM to execute jupiter swaps
const ICSFlowMainnetAddress = "0x16906ADb704590F94F8a32ff0a690306A34A0bfC";

// bytes32 of the ICSFlowMainnet contract as reported by itself
const contractPublicKey = new PublicKey(
  ethers.encodeBase58(
    "0xda5edfafd40cac749b5b97cb3a5e73e0a67885610550451be73019fbab0cdb3f"
  )
);

// bytes32 of the neon program as reported by the ICSFlowMainnnet contract
const neonProgram = new PublicKey(
  ethers.encodeBase58(
    "0x058bf1f0ab8c7508d14efe57c15e86b22cf8246ca415ca5c4f69b3529a0f073b"
  )
);


export {
    ICSFlowMainnetAddress,
    ERC20ForSplFactoryAddress,
    contractPublicKey,
    neonProgram
}
