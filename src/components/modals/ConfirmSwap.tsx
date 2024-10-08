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
import { useCallback, useEffect, useState } from "react";
import { ZeroAddress } from "ethers";
import { publicKeyToBytes32 } from "@/libs/hooks/neon/utils";
import { ERC20ForSplFactoryAbi } from "@/libs/hooks/neon/abis/ERC20ForSplFactory";
import { fetchSwapInstruction } from "@/libs/hooks/jupiter/useSwap";
import { ICSJupiterSwapAbi } from "@/libs/hooks/neon/abis/ICSJupiterSwap";
import { toast } from "react-toastify";
import TransactionToast from "../toasts/TransactionToast";

interface Props {
  onClose: () => void;
  price: number | null;
}

const SwapButton: React.FC<{
  handleSwap: () => void;
  disabled: boolean;
  text: string;
}> = ({ handleSwap, disabled, text }) => {
  return (
    <button
      className="bg-primary w-full py-2 text-background rounded-md font-semibold hover:bg-primary/75"
      onClick={handleSwap}
      aria-label={text}
      disabled={disabled}
      type="button"
    >
      {text}
    </button>
  );
};

const ConfirmSwap: NextPage<Props> = ({ onClose, price }) => {
  const [hasAllowance, setHasAllowance] = useState(false);
  const [hasSpl, setHasSpl] = useState(false);
  const [swapStep, setSwapStep] = useState<
    | "idle"
    | "approving"
    | "approvalPending"
    | "splDeploying"
    | "splDeployPending"
    | "readyToSwap"
    | "swapping"
    | "swapPending"
    | "completed"
    | "approvalCompleted"
    | "splDeployCompleted"
    | "error"
  >("idle");

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

  const txReceipt = useWaitForTransactionReceipt({
    hash,
  });

  const [transactionStatus, setTransactionStatus] = useState("");

  useEffect(() => {
    if (!hash) return;

    if (txReceipt.isPending && transactionStatus !== "pending") {
      setTransactionStatus("pending");
      toast.info(<TransactionToast status="pending" tx={hash} />);
    }

    if (txReceipt.isSuccess && transactionStatus !== "success") {
      setTransactionStatus("success");
      toast.success(<TransactionToast status="success" tx={hash} />);

      if (swapStep === "approvalPending") {
        setHasAllowance(true);
        setSwapStep("approvalCompleted");
      } else if (swapStep === "splDeployPending") {
        setHasSpl(true);
        setSwapStep("splDeployCompleted");
      } else if (swapStep === "swapPending") {
        setSwapStep("completed");
      }
    }

    if (txReceipt.isError && txReceipt.error && transactionStatus !== "error") {
      setTransactionStatus("error");
      toast.error(
        <TransactionToast status="error" tx={txReceipt.error.message} />,
      );
      setSwapStep("error");
    }
  }, [
    hash,
    txReceipt.isSuccess,
    txReceipt.isPending,
    txReceipt.isError,
    txReceipt.error,
    swapStep,
    transactionStatus,
  ]);

  useEffect(() => {
    if (isError && error) {
      toast(<TransactionToast status="error" tx={error.name} />);
      console.error(error);
      setSwapStep("error");
    }
  }, [error, isError]);

  useEffect(() => {
    if (inputTokenAllowance.data && inputToken.weiAmount) {
      const allowanceBigInt = BigInt(inputTokenAllowance.data ?? 0);
      const inputAmountWeiBigInt = BigInt(inputToken.weiAmount);

      if (allowanceBigInt >= inputAmountWeiBigInt) {
        setHasAllowance(true);
      } else {
        setHasAllowance(false);
      }
    }
  }, [inputTokenAllowance.data, inputToken.weiAmount]);

  useEffect(() => {
    if (outputToken.evm && outputToken.evm !== ZeroAddress) {
      setHasSpl(true);
    } else {
      setHasSpl(false);
    }
  }, [outputToken.evm]);

  const handleApproval = useCallback(() => {
    if (inputToken.evm && inputToken.weiAmount) {
      setSwapStep("approving");
      writeContract({
        abi: ERC20ForSPLAbi,
        address: inputToken.evm,
        functionName: "approve",
        args: [ICSFlowMainnetAddress, BigInt(inputToken.weiAmount)],
      });
      setSwapStep("approvalPending");
    }
  }, [inputToken.evm, inputToken.weiAmount, writeContract]);

  const handleSplDeployment = useCallback(() => {
    if (outputToken.evm === ZeroAddress) {
      setSwapStep("splDeploying");
      writeContract({
        abi: ERC20ForSplFactoryAbi,
        address: ERC20ForSplFactoryAddress,
        functionName: "createErc20ForSpl",
        args: [publicKeyToBytes32(outputToken.svm)],
      });
      setSwapStep("splDeployPending");
    }
  }, [outputToken.evm, outputToken.svm, writeContract]);

  const proceedToSwap = useCallback(async () => {
    if (
      !quote ||
      !inputToken.evm ||
      !outputToken.evm ||
      !address ||
      !inputToken.weiAmount
    )
      return;

    setSwapStep("swapping");
    console.log("Executing swap");
    const instructions = await fetchSwapInstruction(
      quote,
      outputToken.evm,
      address,
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
    console.log("Swap transaction submitted");
    setSwapStep("swapPending");
  }, [
    quote,
    inputToken.evm,
    outputToken.evm,
    address,
    inputToken.weiAmount,
    writeContract,
  ]);

  const handleSwap = useCallback(() => {
    if (!hasAllowance) {
      setSwapStep("idle");
      console.log("Approval required");
      return;
    }

    if (!hasSpl) {
      setSwapStep("idle");
      console.log("SPL deployment required");
      return;
    }

    if (
      hasAllowance &&
      hasSpl &&
      inputToken.evm &&
      outputToken.evm &&
      outputToken.evm !== ZeroAddress &&
      quote &&
      address
    ) {
      console.log("Ready to swap");
      setSwapStep("readyToSwap");
    }
  }, [address, hasAllowance, hasSpl, inputToken.evm, outputToken.evm, quote]);

  useEffect(() => {
    handleSwap();
  }, [handleSwap]);

  const minimumReceived = (
    (outputToken.humanAmount ?? 0) *
    (1 - (quote?.slippageBps ?? 0) / 10000)
  ).toPrecision(4);

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
                <div className="">{(quote?.slippageBps ?? 0) / 100}%</div>
              </div>
              <p className="text-justify text-sm">
                Output is estimated. You will receive at least{" "}
                <span className="font-semibold text-secondary">
                  {minimumReceived}
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
                <div>{minimumReceived}</div>
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

            {!hasSpl && (
              <SwapButton
                handleSwap={handleSplDeployment}
                text="Create ERC20 wrapper"
                disabled={swapStep !== "idle" && swapStep !== "error"}
              />
            )}

            {hasSpl && !hasAllowance && (
              <SwapButton
                handleSwap={handleApproval}
                text="Approve Allowance"
                disabled={swapStep != "idle" && swapStep !== "error"}
              />
            )}

            {hasAllowance && hasSpl && (
              <SwapButton
                handleSwap={proceedToSwap}
                text="Execute Swap"
                disabled={
                  swapStep !== "idle" &&
                  swapStep !== "approvalCompleted" &&
                  swapStep !== "splDeployCompleted" &&
                  swapStep !== "error" &&
                  swapStep !== "readyToSwap"
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSwap;
