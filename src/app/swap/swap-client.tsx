"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { defaultInputToken, defaultOutputToken } from "@/libs/defaultToken";
import SlippageSettingsModal from "@/components/modals/SlippageSettingsModal";
import ConfirmSwap from "@/components/modals/ConfirmSwap";
import SwapInputComponent from "@/components/input/SwapInputComponent";
import SwapBtn from "@/components/button/SwapBtn";

// Icons
import { FaArrowRotateLeft, FaGear } from "react-icons/fa6";
import { PiArrowsDownUpBold } from "react-icons/pi";
import { useAccount, useBalance, useReadContract, useWriteContract } from "wagmi";
import { useQuote } from "@/libs/hooks/jupiter/useQuote";
import { useTokenList } from "@/libs/tokens";
import useGetSPL from "@/libs/hooks/neon/useGetSPL";
import { ICSJupiterSwapAbi } from "@/libs/hooks/neon/abis/ICSJupiterSwap";
import { ERC20ForSplFactoryAddress, ICSFlowMainnetAddress } from "@/libs/hooks/neon/constants";
import { fetchSwapInstruction } from "@/libs/hooks/jupiter/useSwap";
import { ERC20ForSPLAbi } from "@/libs/hooks/neon/abis/ERC20ForSPL";
import { ERC20ForSplFactoryAbi } from "@/libs/hooks/neon/abis/ERC20ForSplFactory";
import { publicKeyToBytes32 } from "@/libs/hooks/neon/utils";
import { ZeroAddress } from "ethers";

export default function SwapClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tokens, setTokens] = useState<Token[]>([]);

  const [inputAmount, setInputAmount] = useState(0);
  const [outputAmount, setOutputAmount] = useState(0);

  const [inputToken, setInputToken] = useState<Token>(defaultInputToken);
  const [outputToken, setOutputToken] = useState<Token>(defaultOutputToken);

  const [isSlippage, setIsSlippage] = useState(false);

  const {data, isSuccess, isLoading, isError, error} = useTokenList()

const [isConfirmSwapModal, setIsConfirmSwapModal] = useState(false);

 const [isConfirmSwap, setIsConfirmSwap] = useState(true);

  useEffect(() => {
      if (isSuccess) {
        setTokens([defaultInputToken, ...data]);
      }
  }, [data, isSuccess]);


	// Check if ConfirmSwap btn is openable - in & out amount set
	useEffect(() => {
		if (inputAmount && outputAmount) {
			setIsConfirmSwap(false);
		}
	}, [setIsConfirmSwap, inputAmount, outputAmount]);

  useEffect(() => {
    if (tokens.length > 0) {
      const inputCurrency = searchParams.get("inputCurrency");
      const outputCurrency = searchParams.get("outputCurrency");
      const foundInputToken =
        tokens.find((t) => t.address === inputCurrency) || defaultInputToken;
      const foundOutputToken =
        tokens.find((t) => t.address === outputCurrency) || defaultOutputToken;
      setInputToken(foundInputToken);
      setOutputToken(foundOutputToken);
    }
  }, [searchParams, tokens]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("inputCurrency", inputToken.address);
    params.set("outputCurrency", outputToken.address);

    router.push(`/swap?${params.toString()}`);
  }, [inputToken, outputToken, router]);

  const { address } = useAccount();

  const {
    data: inputNeonAddress,
    isError: isInputError,
    error: inputError,
  } = useGetSPL(inputToken.address);

  const {
    data: outputNeonAddress,
    isError: isOutputError,
    error: outputError,
  } = useGetSPL(outputToken.address);

  const { data: quote, isPending } = useQuote({
    inputMint: inputToken.address,
    outputMint: outputToken.address,
    amount: inputAmount * 10 ** inputToken.decimals,
    slippageBps: 5,
    enabled: inputAmount != 0,
  });

const {
    data: outputTokenBalance
} = useBalance({
    address,
    token: outputNeonAddress
})

const {
    data: inputTokenBalance
} = useBalance({
    address,
    token: inputNeonAddress
})

  const {
    writeContract,
    error: contractError,
    isError: isContractError,
  } = useWriteContract();

  useEffect(() => {
    if (contractError) {
      console.log(contractError);
    }
  }, [contractError, isContractError]);

  const inputTokenAllowance = useReadContract({
      abi: ERC20ForSPLAbi,
      address: inputNeonAddress,
      functionName: 'allowance',
      args: [address ?? '0x00', ICSFlowMainnetAddress]
  })


  const handleSwap = async () => {
    console.log("swapping");
    if (isInputError) {
      console.error(inputError);
      return;
    }

    if (isOutputError) {
      console.error(outputError);
      return;
    }

    if (!inputNeonAddress) {
        console.error("couldnt get input neon address")
        return
    }

    if (!address) {
        console.error("couldnt get user address")
        return
    }

    if (outputNeonAddress == ZeroAddress) {
        console.error("couldnt get neon output token, you most likely will have to approve the tx and deploy the spl")
        writeContract({
            abi: ERC20ForSplFactoryAbi,
            address: ERC20ForSplFactoryAddress,
            functionName: 'createErc20ForSpl',
            args: [publicKeyToBytes32(outputToken.address)]
        })

        return
    }

    const inputAmountWei = BigInt(inputAmount * (10**inputToken.decimals))

    if (BigInt(inputTokenAllowance.data??0) < inputAmountWei) {
        console.log(`allowance: ${inputTokenAllowance.data?.toString(10)} - ${inputAmountWei}`)
        writeContract({
            abi: ERC20ForSPLAbi,
            address: inputNeonAddress,
            functionName: 'approve',
            args: [ICSFlowMainnetAddress, inputAmountWei]
        })
        console.error("allowance too low or unset. please approve the spender and try again")
        return
    }

    if (
      quote &&
      !isPending &&
      inputNeonAddress &&
      outputNeonAddress &&
      address
    ) {
      console.log("fetching instructions")
      const instructions = await fetchSwapInstruction(quote, outputNeonAddress, address)  
      console.log("executing instructions")
        writeContract({
          abi: ICSJupiterSwapAbi,
          address: ICSFlowMainnetAddress,
          functionName: "jupiterSwap",
          args: [
            inputNeonAddress,
            outputNeonAddress,
            BigInt(inputAmount * 10 ** inputToken.decimals),
            instructions.programId,
            instructions.data,
            instructions.accounts
            ],
          });
        }
  };

  const handleInputAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAmount(Number(e.target.value));
  };

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
      <SwapInputComponent
        customBg="bg-dark"
        balance={Number(inputTokenBalance?.value ?? 0) / (10 ** (inputTokenBalance?.decimals ?? 1))}
        token={inputToken}
        tokens={tokens}
        amount={inputAmount}
        isLoading={false}
        onSelect={setInputToken}
        defaultToken={defaultInputToken}
        onChange={handleInputAmountChange}
      />
      {/* Swap tokens button */}
      <div className="flex justify-end lg:justify-center items-center h-1.5 w-full relative">
        <button
          className="absolute -top-6 right-1.5 lg:right-auto flex items-center justify-center w-[51px] h-[51px] rounded-full border-4 border-grayBg bg-secondary text-light text-2xl"
          onClick={() => {
            const temp = inputToken;
            setInputToken(outputToken || defaultOutputToken);
            setOutputToken(temp);
            const tempAmount = inputAmount;
            setInputAmount(outputAmount);
            setOutputAmount(tempAmount);
          }}
          type="button"
          aria-label="Swap tokens"
        >
          <PiArrowsDownUpBold />
        </button>
      </div>
      {/* Output */}
      <SwapInputComponent
        customBg="bg-lightGray mb-[34px]"
        balance={Number(outputTokenBalance?.value ?? 0) / (10 ** (outputTokenBalance?.decimals ?? 1))}
        token={outputToken}
        tokens={tokens}
        amount={(Number(quote?.outAmount) ?? 0) / 10 ** outputToken.decimals}
        isLoading={false}
        onSelect={setOutputToken}
        defaultToken={defaultOutputToken}
        readOnly={true}
      />
      <SwapBtn handleSwap={handleSwap} />
    </div>
  );
}
