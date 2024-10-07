"use client";

import { useAccount } from "wagmi";
import CustomConnectWalletBtn from "../button/CustomConnectWalletBtn";
import clsx from "clsx";
import { useEffect, useState } from "react";

const SwapBtn = ({
  confirmSwapModal,
  isDisabled,
}: {
  confirmSwapModal: () => void;
  isDisabled: boolean;
}) => {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-11 bg-grayBg rounded-lg" />;
  }

  if (!isConnected) {
    return <CustomConnectWalletBtn className={clsx("w-full")} />;
  }

  return (
    <button
      className={clsx(
        "w-full text-center font-semibold text-dark py-2 lg:py-3 rounded-lg",
        isDisabled ? " cursor-not-allowed bg-lightGray" : "bg-primary "
      )}
      disabled={isDisabled}
      type="button"
      onClick={confirmSwapModal}
    >
      Swap
    </button>
  );
};

export default SwapBtn;
