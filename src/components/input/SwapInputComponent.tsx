"use client";

import Image from "next/image";
import TokenSelectorModal from "@/components/modals/TokenSelectorModal";
import { FaAngleDown } from "react-icons/fa6";
import { useState } from "react";
import clsx from "clsx";
import { useAppDispatch } from "@/libs/hooks/redux/redux";
import { setInputTokenAmount, SwapToken } from "@/libs/features/swap/swapSlice";
import { useGetTokenPriceQuery } from "@/libs/features/jupiter/priceSlice";

interface SwapInputComponentProps {
  setType: "input" | "output";
  token: Token;
  amount?: number;
  defaultToken?: Token;
  isLoading: boolean;
  onSelect: (token: Token) => void;
  customBg: string;
  readOnly?: boolean;
  balance?: number;
}

const DEFAULT_LOGO_URI =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";

const SwapInputComponent = ({
  token,
  amount,
  isLoading,
  defaultToken,
  customBg,
  readOnly,
  balance,
  setType,
}: SwapInputComponentProps) => {
  const [imageError, setImageError] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const dispatch = useAppDispatch();

  const toggleSelector = () => setIsSelectorOpen(!isSelectorOpen);

  const {data: tokenUsdPrice} = useGetTokenPriceQuery(token.address)
  const userBalanceUsd = (balance ?? 0) * (tokenUsdPrice?.data[token.address]?.price ?? 0)
  console.log(tokenUsdPrice)

  const handleAmountChange = (e: any) => {
    if (setType == "input") {
      dispatch(setInputTokenAmount(Number(e.target.value)));
    }
  };

  return (
    <div className={clsx("w-full flex flex-col p-4 rounded-lg", customBg)}>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <button
            className="flex items-center justify-between gap-x-2 bg-grayBg px-3 py-1.5 rounded-md h-[35px] max-w-md"
            type="button"
            onClick={toggleSelector}
          >
            <div className="w-full h-full flex items-center gap-x-2">
              {token.logoURI && (
                <Image
                  className="w-[21px] h-[21px]"
                  src={
                    imageError || !token.logoURI
                      ? DEFAULT_LOGO_URI
                      : token.logoURI
                  }
                  width={21}
                  height={21}
                  alt={`${token.symbol} logo`}
                  onError={() => setImageError(true)}
                />
              )}
              <div className="">{token.symbol}</div>
            </div>
            <div className="" aria-hidden="true">
              <FaAngleDown />
            </div>
          </button>
          <div className="text-xs text-grayText">
            <div className="">Balance</div>
            <div className="">{balance ?? "loading..."}</div>
            <button type="button">MAX</button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="text"
            className="p-2 w-full bg-transparent text-2xl placeholder:text-light/30 outline-none appearance-none"
            placeholder="0.00"
            defaultValue={amount}
            onChange={handleAmountChange}
            aria-label={`Enter amount of ${token.symbol}`}
            readOnly={readOnly ?? false}
          />
          <div className="text-grayText text-xs text-end ">~{userBalanceUsd.toPrecision(3)} USD</div>
        </div>
      </div>
      {isSelectorOpen && (
        <TokenSelectorModal
          setType={setType}
          defaultToken={defaultToken}
          onClose={toggleSelector}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default SwapInputComponent;
