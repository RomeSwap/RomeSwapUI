"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { defaultInputToken, defaultOutputToken } from "@/libs/defaultToken";
import SlippageSettingsModal from "@/components/modals/SlippageSettingsModal";
import { FaArrowRotateLeft, FaGear } from "react-icons/fa6";
import { PiArrowsDownUpBold } from "react-icons/pi";
import { useAccount, useBalance } from "wagmi";
import { useQuote } from "@/libs/hooks/jupiter/useQuote";
import { useAppDispatch, useAppSelector } from "@/libs/hooks/redux/redux";
import {
  fetchSPLAddress,
  selectInputToken,
  selectOutputToken,
  selectSlippage,
  setOutputTokenAmount,
  setToken,
  setTokenList,
  setUserbalance,
  swapInputOutput,
} from "@/libs/features/swap/swapSlice";
import SwapInput from "@/components/input/SwapInput";
import SwapOutput from "@/components/input/SwapOutput";
import SwapBtn from "@/components/button/SwapBtn";
import ConfirmSwap from "@/components/modals/ConfirmSwap";
import { useTokenList } from "@/libs/tokens";

export default function SwapClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [tokens, setTokens] = useState<Token[]>([]);

  const [isSlippage, setIsSlippage] = useState(false);
  const [isConfirmSwapModal, setIsConfirmSwapModal] = useState(false);

  const { data, isSuccess, isLoading, isError, error } = useTokenList();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setTokenList(data));
    }
  }, [dispatch, data, isSuccess]);

  const inputToken = useAppSelector(selectInputToken);
  const outputToken = useAppSelector(selectOutputToken);

  useEffect(() => {
    if (isSuccess) {
      setTokens([defaultInputToken, ...data]);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (tokens.length > 0) {
      const inputCurrency = searchParams.get("inputCurrency");
      const outputCurrency = searchParams.get("outputCurrency");
      const foundInputToken =
        tokens.find((t) => t.address === inputCurrency) || defaultInputToken;
      const foundOutputToken =
        tokens.find((t) => t.address === outputCurrency) || defaultOutputToken;
      dispatch(
        setToken({
          token: foundInputToken,
          type: "input",
        })
      );
      dispatch(
        fetchSPLAddress({
          solAddress: foundInputToken.address,
          selType: "input",
        })
      );
      dispatch(
        setToken({
          token: foundOutputToken,
          type: "output",
        })
      );
      dispatch(
        fetchSPLAddress({
          solAddress: foundOutputToken.address,
          selType: "output",
        })
      );
    }
  }, [dispatch, searchParams, tokens]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("inputCurrency", inputToken.svm);
    params.set("outputCurrency", outputToken.svm);

    router.push(`/swap?${params.toString()}`);
  }, [inputToken, outputToken, router]);

  const { address } = useAccount();

  const slippage = useAppSelector(selectSlippage);

  const { data: quote,isError: isQuoteError, isPending } = useQuote({
    inputMint: inputToken.svm,
    outputMint: outputToken.svm,
    amount: Number(inputToken.weiAmount),
    slippageBps: slippage,
    enabled: Number(inputToken.weiAmount) != 0,
  });

  useEffect(() => {
    if (!isPending && !isQuoteError &&  quote) {
      dispatch(setOutputTokenAmount(quote));
    }
  }, [dispatch, quote, isPending, isQuoteError]);

  const { data: outputTokenBalance } = useBalance({
    address,
    token: outputToken.evm,
    query: {
      refetchInterval: 5000,
    },
  });

  const { data: inputTokenBalance } = useBalance({
    address,
    token: inputToken.evm,
    query: {
      refetchInterval: 5000,
    },
  });

  useEffect(() => {
    if (outputTokenBalance && inputToken.evm) {
      dispatch(
        setUserbalance({
          amount: Number(outputTokenBalance.value),
          type: "output",
        })
      );
    }

    if (inputTokenBalance && inputToken.evm) {
      dispatch(
        setUserbalance({
          amount: Number(inputTokenBalance.value),
          type: "input",
        })
      );
    }
  }, [
    dispatch,
    outputTokenBalance,
    inputTokenBalance,
    inputToken.evm,
    outputToken.evm,
    address,
  ]);

  if (isLoading) {
    return <div>Loading tokens...</div>;
  }

  if (isError && error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="p-5 bg-grayBg rounded-2xl max-w-xs lg:max-w-2xl mx-auto flex flex-col ">
      <div className="w-full flex items-center justify-end gap-x-2 mb-4">
        <button
          type="button"
          className="flex items-center justify-center w-[32px] h-[32px] bg-primary text-grayBg rounded-full"
        >
          <span className="text-xl">
            <FaArrowRotateLeft />
          </span>
        </button>
        <button
          type="button"
          className=" text-4xl text-light"
          aria-label="Open slippage settings"
          onClick={() => setIsSlippage(true)}
        >
          <span className="text-[32px]">
            <FaGear />
          </span>
        </button>
        {isSlippage && (
          <SlippageSettingsModal onClose={() => setIsSlippage(false)} />
        )}
      </div>
      <SwapInput />
      {/* Swap tokens button */}
      <div className="flex justify-end lg:justify-center items-center h-1.5 w-full relative">
        <button
          className="absolute -top-6 right-1.5 lg:right-auto flex items-center justify-center w-[51px] h-[51px] rounded-full border-4 border-grayBg bg-secondary text-light text-2xl"
          onClick={() => dispatch(swapInputOutput())}
          type="button"
          aria-label="Swap tokens"
        >
          <PiArrowsDownUpBold />
        </button>
      </div>
      {/* Output */}
      <SwapOutput />
      <SwapBtn
        confirmSwapModal={() => setIsConfirmSwapModal(!isConfirmSwapModal)}
        isDisabled={inputToken.weiAmount == 0}
      />
      {isConfirmSwapModal && (
        <ConfirmSwap
          onClose={() => setIsConfirmSwapModal(!setIsConfirmSwapModal)}
          price={0}
        />
      )}
    </div>
  );
}
