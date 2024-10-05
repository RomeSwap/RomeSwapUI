"use client";

import { useAppDispatch, useAppSelector } from "@/libs/hooks/redux/redux";
import SwapInputComponent from "./SwapInputComponent";
import { selectInputToken, setToken } from "@/libs/features/swap/swapSlice";
import { defaultOutputToken } from "@/libs/defaultToken";

export const SwapInput = () => {
  const dispatch = useAppDispatch();

  const outputToken = useAppSelector(selectInputToken);

  const handleSelect = (selToken: Token) => {
    dispatch(setToken({ token: selToken, type: "input" }));
  };

  return (
    <SwapInputComponent
      customBg="bg-lightGray mb-[34px]"
      setType="input"
      balance={outputToken.userBalance}
      onSelect={handleSelect}
      token={outputToken}
      amount={outputToken.humanAmount}
      isLoading={false}
      defaultToken={defaultOutputToken}
      readOnly={false}
    />
  );
};

export default SwapInput;
