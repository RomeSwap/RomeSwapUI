"use client";

import { NextPage } from "next";
import Image from "next/image";
import { GoArrowDown, GoXCircleFill } from "react-icons/go";
import { useAppSelector } from "@/libs/hooks/redux/redux";
import {
  selectInputToken,
  selectOutputToken,
  selectQuote,
} from "@/libs/features/swap/swapSlice";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ERC20ForSPLAbi } from "@/libs/hooks/neon/abis/ERC20ForSPL";
import {
  ERC20ForSplFactoryAddress,
  ICSFlowMainnetAddress,
} from "@/libs/hooks/neon/constants";
import { useEffect, useState } from "react";
import { ZeroAddress } from "ethers";
import { publicKeyToBytes32 } from "@/libs/hooks/neon/utils";
import { ERC20ForSplFactoryAbi } from "@/libs/hooks/neon/abis/ERC20ForSplFactory";
import { fetchSwapInstruction } from "@/libs/hooks/jupiter/useSwap";
import { ICSJupiterSwapAbi } from "@/libs/hooks/neon/abis/ICSJupiterSwap";
import toast from "react-hot-toast";
import TransactionToast from "../toasts/TransactionToast";

interface Props {
  onClose: () => void;
  price: number | null;
}

const ConfirmSwap: NextPage<Props> = ({ onClose, price }) => {
  const [hasAllowance, setAllowance] = useState(false);
  const [hasSpl, setHasSpl] = useState(false);

  const quote = useAppSelector(selectQuote);
  const inputToken = useAppSelector(selectInputToken);
  const outputToken = useAppSelector(selectOutputToken);

  const { address } = useAccount();

  const inputTokenAllowance = useReadContract({
    abi: ERC20ForSPLAbi,
    address: inputToken.evm,
    functionName: "allowance",
    args: [address ?? "0x0", ICSFlowMainnetAddress],
    query: {
      refetchInterval: 5000,
    },
  });

  const { writeContract, data: hash, error, isError } = useWriteContract();

  useEffect(() => {
    if (isError && error) {
      toast.custom(<TransactionToast status="error" tx={error.message} />);
      console.error(error);
    }
  }, [error, isError]);

  const txReceipt = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (!hash) return;

    if (txReceipt.isSuccess) {
      toast.custom(<TransactionToast status="success" tx={hash} />);
    }

    if (txReceipt.isPending) {
      toast.custom(<TransactionToast status="pending" tx={hash} />);
    }

    if (txReceipt.isError && txReceipt.error) {
      toast.custom(
        <TransactionToast status="error" tx={txReceipt.error.message} />
      );
    }
  }, [
    hash,
    txReceipt.isSuccess,
    txReceipt.isPending,
    txReceipt.isError,
    txReceipt.error,
  ]);

  useEffect(() => {
    if (outputToken.evm && outputToken.evm != ZeroAddress) {
      setHasSpl(true);
    }
  }, [outputToken.evm]);

  useEffect(() => {
    if (inputTokenAllowance.data) {
      const inputAmountWei = inputToken.weiAmount;

      if (BigInt(inputTokenAllowance.data ?? 0) < BigInt(inputAmountWei)) {
        setAllowance(false);
        return;
      }

      setAllowance(true);
    }
  }, [inputTokenAllowance.data, inputToken.weiAmount]);

  const handleApproval = () => {
    if (inputToken.evm) {
      writeContract({
        abi: ERC20ForSPLAbi,
        address: inputToken.evm,
        functionName: "approve",
        args: [ICSFlowMainnetAddress, BigInt(inputToken.weiAmount)],
      });
    }
  };

  const handleSplDeployment = () => {
    if (outputToken.evm == ZeroAddress) {
      writeContract({
        abi: ERC20ForSplFactoryAbi,
        address: ERC20ForSplFactoryAddress,
        functionName: "createErc20ForSpl",
        args: [publicKeyToBytes32(outputToken.svm)],
      });
    }
  };

  const handleSwap = async () => {
    // the executor must be allowed to take inputTokens out of our account
    if (!hasAllowance) {
      console.log("waiting for allowance");
      handleApproval();
      return;
    }

    // there must be an spl contract for the output token.
    // the input token must already have an spl, because you are trying
    // to swap it
    if (!hasSpl) {
      console.log("waiting for spl deployment");
      handleSplDeployment();
      return;
    }

    // if we got the allowance and the output token we can proceed with the actual swap
    if (
      hasAllowance &&
      inputToken.evm &&
      outputToken.evm &&
      outputToken.evm != ZeroAddress &&
      quote &&
      address
    ) {
      console.log("executing swap");
      const instructions = await fetchSwapInstruction(
        quote,
        outputToken.evm,
        address
      );
      console.log(instructions);
      writeContract({
        abi: ICSJupiterSwapAbi,
        address: ICSFlowMainnetAddress,
        functionName: "jupiterSwap",
        args: [
          inputToken.evm,
          outputToken.evm,
          BigInt(inputToken.weiAmount),
          instructions.programId,
          instructions.data,
          instructions.accounts,
        ],
      });
      console.log("write executed");
      return;
    }
  };

  return (
    <div>
      <div className="absolute z-50 top-0 left-0 w-screen h-screen flex items-center justify-center">
        <div
          className="w-full h-full bg-transparent backdrop-blur-lg"
          onClick={onClose}
        ></div>
        <div className="absolute bg-grayBg rounded-lg w-[90%] md:max-w-md lg:w-[641px] flex flex-col items-center overflow-hidden">
          {/* Head */}
          <div className="flex items-center justify-between w-full p-4 bg-secondary/40">
            <div className="font-semibold">Confirm Swap</div>
            <button
              className="text-3xl lg:text-4xl text-grayText"
              onClick={onClose}
              aria-label="Close token selector"
              type="button"
            >
              <GoXCircleFill />
            </button>
          </div>
          {/* Body */}
          <div className="flex flex-col items-center w-full p-4 gap-y-5">
            <div className=" relative flex flex-col items-center w-full gap-y-4">
              {/* Input */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-x-1">
                  <Image
                    className="rounded-full"
                    src={inputToken.logoURI}
                    width={32}
                    height={32}
                    alt={inputToken.name}
                  />
                  <div>{inputToken.name}</div>
                </div>
                <div>{inputToken.humanAmount}</div>
              </div>
              <div className="absolute w-full h-0 top-[50%] flex items-center justify-center">
                <div className="text-2xl flex items-center justify-center animate-bounce">
                  <GoArrowDown />
                  <GoArrowDown />
                </div>
              </div>
              {/* Output */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-x-1">
                  <Image
                    className="rounded-full"
                    src={outputToken.logoURI}
                    width={32}
                    height={32}
                    alt={outputToken.name}
                  />
                  <div>{outputToken.name}</div>
                </div>
                <div>{outputToken.humanAmount}</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-y-2 justify-between w-full text-sm">
              <div className="w-full flex items-center justify-between">
                <div className="text-primary">Slippage tolerance</div>
                <div className="">{quote?.slippageBps}%</div>
              </div>
              <p className="text-justify text-sm">
                Output is estimated. You will receive at least{" "}
                <span className="font-semibold text-secondary">
                  {outputToken.humanAmount}
                </span>{" "}
                {outputToken.symbol} or the transaction will revert.
              </p>
            </div>
            <div className="w-full flex flex-col bg-background text-grayText text-sm rounded-md p-4 gap-y-2">
              <div className="flex items-center justify-between">
                <div>Price</div>
                <div>
                  {price} {inputToken.symbol}/{outputToken.symbol}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>Minimum received</div>
                <div>{outputToken.humanAmount}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>Price Impact</div>
                <div className="text-primary">
                  {parseFloat(quote?.priceImpactPct ?? "0").toFixed(4)}%
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>Trading fee</div>
                <div>{quote?.platformFee?.amount ?? 0} SOL</div>
              </div>
            </div>
            <button
              className="bg-primary w-full py-2 text-background rounded-md font-semibold hover:bg-primary/75"
              onClick={handleSwap}
              aria-label="Confirm Swap"
              type="button"
            >
              {hasAllowance
                ? hasSpl
                  ? "Confirm Swap"
                  : "Deploy SPL"
                : "Set Allowance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSwap;
