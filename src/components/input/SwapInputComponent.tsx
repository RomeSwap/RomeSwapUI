"use client";

import Image from "next/image";
import TokenSelectorModal from "@/components/modals/TokenSelectorModal";
import { FaAngleDown } from "react-icons/fa6";
import { useState } from "react";
import clsx from "clsx";
import { useAppDispatch } from "@/libs/hooks/redux/redux";
import { setInputTokenAmount, SwapToken } from "@/libs/features/swap/swapSlice";
import { useGetTokenPriceQuery } from "@/libs/features/jupiter/priceSlice";
import { nexa } from "@/app/fonts/fonts";
import UserBalance from "../info/UserBalance";

interface SwapInputComponentProps {
  setType: "input" | "output";
  token: SwapToken;
  defaultToken?: Token;
  customBg: string;
  readOnly?: boolean;
}

const DEFAULT_LOGO_URI =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";

const SwapInputComponent = ({
  token,
  defaultToken,
  customBg,
  readOnly,
  setType,
}: SwapInputComponentProps) => {
  const [imageError, setImageError] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const dispatch = useAppDispatch();

  const toggleSelector = () => setIsSelectorOpen(!isSelectorOpen);

  const { data: tokenUsdPrice } = useGetTokenPriceQuery(token.address, {
    pollingInterval: 5000,
  });

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
          <UserBalance tokenEvmAddress={token.evm} setType={setType} />
        </div>
        <div
          className={clsx(
            "flex items-center justify-between font-thin",
            nexa.className
          )}
        >
          <input
            type="text"
            className="p-2 w-full bg-transparent text-2xl placeholder:text-light/30 outline-none appearance-none"
            placeholder="0.00"
            defaultValue={token.humanAmount}
            onChange={handleAmountChange}
            aria-label={`Enter amount of ${token.symbol}`}
            readOnly={readOnly ?? false}
          />
          <div
            hidden={!token.humanAmount || !tokenUsdPrice}
            className="text-grayText text-xs text-end "
          >
            ~
            {(
              Number(token.humanAmount ?? 0) *
              (tokenUsdPrice?.data[token.address]?.price ?? 0)
            ).toPrecision(3)}{" "}
            USD
          </div>
        </div>
      </div>
      {isSelectorOpen && (
        <TokenSelectorModal
          setType={setType}
          defaultToken={defaultToken}
          onClose={toggleSelector}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default SwapInputComponent;
