import { selectInputToken } from "@/libs/features/swap/swapSlice";
import { calculateTokenAccount } from "@/libs/hooks/neon/utils";
import { useAppSelector } from "@/libs/hooks/redux/redux";
import { useAccount } from "wagmi";

const Mercuryo = () => {
  const { address } = useAccount();

  const inputToken = useAppSelector(selectInputToken);

  const handleRedirect = async () => {
    if (!inputToken.evm || !address) return;

    const tokenAccount = calculateTokenAccount(inputToken.evm, address);

    try {
      const response = await fetch(
        `/api/mercuryo?address=${tokenAccount}&token=SOL&currency=SOL&amount=10`,
      );

      if (!response.ok) {
        throw new Error("Failed to generate URL");
      }

      const data = await response.json();

      if (data.url) {
        window.open(data.url);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!inputToken.evm || !address) return;

  return (
    <div>
      <button onClick={handleRedirect}>"Buy with Mercuryo"</button>
    </div>
  );
};

export default Mercuryo;
