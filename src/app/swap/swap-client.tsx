"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { defaultInputToken, defaultOutputToken } from "@/libs/defaultToken";
import SlippageSettingsModal from "@/components/modals/SlippageSettingsModal";
import { FaArrowRotateLeft, FaGear } from "react-icons/fa6";
import { PiArrowsDownUpBold } from "react-icons/pi";
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
  swapInputOutput,
} from "@/libs/features/swap/swapSlice";
import SwapBtn from "@/components/button/SwapBtn";
import ConfirmSwap from "@/components/modals/ConfirmSwap";
import { useGetVerifiedTokensQuery } from "@/libs/features/jupiter/tokenSlice";
import SwapInputComponent from "@/components/input/SwapInputComponent";
import RefreshBtn from "@/components/button/RefreshBtn";
// import TransactionToast from "@/components/toasts/TransactionToast";
// import { toast } from "react-toastify";

export default function SwapClient() {
  const [isSlippage, setIsSlippage] = useState(false);
  const [isConfirmSwapModal, setIsConfirmSwapModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const inputCurrency = searchParams.get("inputCurrency");
  const outputCurrency = searchParams.get("outputCurrency");
  const dispatch = useAppDispatch();

  const tokenQuery = useGetVerifiedTokensQuery();
  const inputToken = useAppSelector(selectInputToken);
  const outputToken = useAppSelector(selectOutputToken);
  const slippage = useAppSelector(selectSlippage);

  const {
    data: quote,
    isError: isQuoteError,
    isPending,
  } = useQuote({
    inputMint: inputToken.svm,
    outputMint: outputToken.svm,
    amount: inputToken.weiAmount,
    slippage,
    enabled: inputToken.weiAmount !== undefined && inputToken.weiAmount != 0,
  });

  useEffect(() => {
    if (tokenQuery.isSuccess && tokenQuery.data) {
      dispatch(setTokenList(tokenQuery.data));
    }
  }, [dispatch, tokenQuery.data, tokenQuery.isSuccess]);

  useEffect(() => {
    if (tokenQuery.data && tokenQuery.data.length > 0) {
      const foundInputToken =
        tokenQuery.data.find((t) => t.address === inputCurrency) ||
        defaultInputToken;
      dispatch(
        setToken({
          token: foundInputToken,
          type: "input",
        }),
      );
      dispatch(
        fetchSPLAddress({
          solAddress: foundInputToken.address,
          selType: "input",
        }),
      );
    }
  }, [dispatch, inputCurrency, tokenQuery.data]);

  useEffect(() => {
    if (tokenQuery.data && tokenQuery.data.length > 0) {
      const foundOutputToken =
        tokenQuery.data.find((t) => t.address === outputCurrency) ||
        defaultOutputToken;
      dispatch(
        setToken({
          token: foundOutputToken,
          type: "output",
        }),
      );
      dispatch(
        fetchSPLAddress({
          solAddress: foundOutputToken.address,
          selType: "output",
        }),
      );
    }
  }, [dispatch, outputCurrency, tokenQuery.data]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("inputCurrency", inputToken.svm);

    router.push(`/swap?${params.toString()}`);
  }, [inputToken, searchParams, router]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("outputCurrency", outputToken.svm);

    router.push(`/swap?${params.toString()}`);
  }, [outputToken, searchParams, router]);

  useEffect(() => {
    if (!isPending && !isQuoteError && quote) {
      dispatch(setOutputTokenAmount(quote));
    }
  }, [dispatch, quote, isPending, isQuoteError]);

  // const toastTest = () => {
  //   toast.success(<TransactionToast status="success" tx={"0x00000"} />);
  //   toast.info(<TransactionToast status="pending" tx={"0x00000"} />);
  //   toast.error(<TransactionToast status="error" tx={"0x00000"} />);
  // };

  return (
    <section className="h-auto p-5 bg-grayBg rounded-2xl  w-[95%] max-w-[428px] lg:w-[428px] flex flex-col justify-center">
      <div className="w-full flex items-center justify-end gap-x-2 mb-4">
        <RefreshBtn />
        <button
          type="button"
          className=" text-light"
          aria-label="Open slippage settings"
          onClick={() => setIsSlippage(true)}
        >
          <span className="text-lg lg:text-xl">
            <FaGear />
          </span>
        </button>
        {isSlippage && (
          <SlippageSettingsModal onClose={() => setIsSlippage(false)} />
        )}
      </div>
      <SwapInputComponent
        customBg="bg-lightGray"
        setType="input"
        token={inputToken}
        defaultToken={defaultInputToken}
        readOnly={false}
      />
      {/* Swap tokens button */}
      <div className="flex justify-end lg:justify-center items-center h-1.5 lg:h-2 my-0.5 w-full relative">
        <button
          className="absolute -top-6 right-1.5 lg:right-auto flex items-center justify-center w-[51px] h-[51px] rounded-full border-[6px] border-grayBg bg-[#FF9900] text-light text-2xl"
          onClick={() => dispatch(swapInputOutput())}
          type="button"
          aria-label="Swap tokens"
        >
          <PiArrowsDownUpBold />
        </button>
      </div>
      {/* Output */}
      <SwapInputComponent
        customBg="bg-dark"
        setType="output"
        token={outputToken}
        defaultToken={defaultOutputToken}
        readOnly={true}
      />
      <div className="mt-3">
        <SwapBtn
          confirmSwapModal={() => setIsConfirmSwapModal(!isConfirmSwapModal)}
          isDisabled={
            outputToken.weiAmount === undefined ||
            outputToken.weiAmount === 0 ||
            inputToken.weiAmount === undefined ||
            inputToken.weiAmount >
              (inputToken.userBalance ?? 0) * 10 ** inputToken.decimals
          }
        />
      </div>
      {isConfirmSwapModal && (
        <ConfirmSwap
          onClose={() => setIsConfirmSwapModal(!setIsConfirmSwapModal)}
          price={0}
        />
      )}
    </section>
  );
}
