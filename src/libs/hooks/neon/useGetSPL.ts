import { useReadContract } from "wagmi";
import { publicKeyToBytes32 } from "./utils";
import { ERC20ForSplFactoryAddress } from "./constants";
import { ERC20ForSplFactoryAbi } from "./abis/ERC20ForSplFactory";

const useGetSPL = (solAddress: string) => {
  return useReadContract({
    address: ERC20ForSplFactoryAddress,
    functionName: "getErc20ForSpl",
    abi: ERC20ForSplFactoryAbi,
    args: [publicKeyToBytes32(solAddress)],
  });
};

export default useGetSPL;
