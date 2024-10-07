import { setUserbalance } from "@/libs/features/swap/swapSlice";
import { useAppDispatch } from "@/libs/hooks/redux/redux";
import { ZeroAddress } from "ethers";
import { useEffect } from "react";
import { Address } from "viem";
import { useAccount, useBalance } from "wagmi";

const UserBalance = ({
  tokenEvmAddress,
  setType,
}: {
  tokenEvmAddress: Address | undefined;
  setType: "input" | "output";
}) => {
  const { address } = useAccount();
  const dispatch = useAppDispatch();

  const { data, isLoading, isSuccess } = useBalance({
    address,
    token: tokenEvmAddress,
    query: {
      refetchInterval: 5000,
    },
  });

  useEffect(() => {
    if (data?.value) {
      dispatch(
        setUserbalance({
          amount: tokenEvmAddress ? Number(data.value) : 0,
          type: setType,
        })
      );
    }
  }, [dispatch, setType, data?.value, tokenEvmAddress]);

  return (
    <div className="text-xs text-grayText">
      <div className="">Balance</div>
      <button type="button">
        {tokenEvmAddress && tokenEvmAddress != ZeroAddress
          ? isLoading
            ? "..."
            : isSuccess && data?.value
            ? (Number(data.value) / 10 ** data.decimals).toPrecision(4)
            : "0"
          : "0"}{" "}
        MAX
      </button>
    </div>
  );
};

export default UserBalance;
