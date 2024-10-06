"use client";

import { useAppDispatch, useAppSelector } from "@/libs/hooks/redux/redux";
import SwapInputComponent from "./SwapInputComponent";
import {
  selectInputToken,
  setToken,
  setUserbalance,
} from "@/libs/features/swap/swapSlice";
import { defaultOutputToken } from "@/libs/defaultToken";
import { useAccount, useBalance } from "wagmi";
import { useEffect, useMemo } from "react";

export const SwapInput = () => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const inputToken = useAppSelector(selectInputToken);

  const inputTokenEvm = useMemo(() => inputToken.evm, [inputToken.evm]);

  const { data: balance } = useBalance({
    address,
    token: inputTokenEvm,
    query: {
      refetchInterval: 5000,
    },
  });

  useEffect(() => {
    if (inputTokenEvm && balance?.value && balance.value !== undefined) {
      dispatch(
        setUserbalance({ amount: Number(balance.value), type: "input" }),
      );
    }
  }, [dispatch, balance?.value, inputTokenEvm]);

  const handleSelect = (selToken: Token) => {
    dispatch(setToken({ token: selToken, type: "input" }));
  };

  return (
    <SwapInputComponent
      customBg="bg-lightGray mb-[34px]"
      setType="input"
      balance={inputToken.userBalance}
      onSelect={handleSelect}
      token={inputToken}
      amount={inputToken.humanAmount}
      isLoading={false}
      defaultToken={defaultOutputToken}
      readOnly={false}
    />
  );
};

export default SwapInput;
