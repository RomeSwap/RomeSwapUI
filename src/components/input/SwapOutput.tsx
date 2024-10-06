"use client";

import { useAppDispatch, useAppSelector } from "@/libs/hooks/redux/redux";
import SwapInputComponent from "./SwapInputComponent";
import {
  selectOutputToken,
  setToken,
  setUserbalance,
} from "@/libs/features/swap/swapSlice";
import { defaultOutputToken } from "@/libs/defaultToken";
import { useAccount, useBalance } from "wagmi";
import { useEffect, useMemo } from "react";

export const SwapOutput = () => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const outputToken = useAppSelector(selectOutputToken);

  const outputTokenEvm = useMemo(() => outputToken.evm, [outputToken.evm]);

  const { data: balance } = useBalance({
    address,
    token: outputTokenEvm,
    query: {
      refetchInterval: 5000,
    },
  });

  useEffect(() => {
    if (outputTokenEvm && balance?.value) {
      dispatch(
        setUserbalance({ amount: Number(balance.value), type: "output" }),
      );
    }
  }, [dispatch, balance?.value, outputTokenEvm]);

  const handleSelect = (selToken: Token) => {
    dispatch(setToken({ token: selToken, type: "output" }));
  };

  return (
    <SwapInputComponent
      customBg="bg-lightGray mb-[34px]"
      setType="output"
      balance={outputToken.userBalance}
      onSelect={handleSelect}
      token={outputToken}
      amount={outputToken.humanAmount}
      isLoading={false}
      defaultToken={defaultOutputToken}
      readOnly={true}
    />
  );
};

export default SwapOutput;
