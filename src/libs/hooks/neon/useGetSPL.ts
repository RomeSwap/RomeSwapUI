import { useReadContract } from "wagmi";
import { abi } from "./ERC20ForSplFactory";
import {ethers} from "ethers"

const ERC20ForSplFactoryAddress = "0x6B226a13F5FE3A5cC488084C08bB905533804720";

export const publicKeyToBytes32 = (solAddress: string) => {
    return ethers.zeroPadValue(ethers.toBeHex(ethers.decodeBase58(solAddress)), 32) as `0x${string}`
}

const useGetSPL = (solAddress: string) => {
  return useReadContract({
    address: ERC20ForSplFactoryAddress,
    functionName: "getErc20ForSpl",
    abi,
    args: [publicKeyToBytes32(solAddress)],
  });
};

export default useGetSPL;
