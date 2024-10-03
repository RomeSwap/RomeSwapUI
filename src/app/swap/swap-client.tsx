"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { abi as ICSJupiterSwapAbi } from "@/libs/hooks/neon/ICSJupiterSwap";
import { defaultInputToken, defaultOutputToken } from "@/libs/defaultToken";
import { getTokenList } from "@/libs/tokens";
import SlippageSettingsModal from "@/components/modals/SlippageSettingsModal";
import { FaArrowRotateLeft, FaGear } from "react-icons/fa6";
import SwapInputComponent from "@/components/input/SwapInputComponent";
import SwapBtn from "@/components/button/SwapBtn";
import { PiArrowsDownUpBold } from "react-icons/pi";
import { useAccount, useWriteContract } from "wagmi";
import { useQuote } from "@/libs/hooks/jupiter/useQuote";
import useGetSPL, { publicKeyToBytes32 } from "@/libs/hooks/neon/useGetSPL";
import { ICSFlowMainnet, prepareInstructionAccounts, prepareInstructionData, useSwapInstructions } from "@/libs/hooks/jupiter/useSwap";
import { Transaction } from "@solana/web3.js";

export default function SwapClient() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [tokens, setTokens] = useState<Token[]>([]);

	const [inputAmount, setInputAmount] = useState(0);
	const [outputAmount, setOutputAmount] = useState(0);

	const [inputToken, setInputToken] = useState<Token>(defaultInputToken);
	const [outputToken, setOutputToken] = useState<Token>(defaultOutputToken);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [isSlippage, setIsSlippage] = useState(false);

	useEffect(() => {
		async function fetchTokens() {
			try {
				const fetchedTokens = await getTokenList();
				setTokens([defaultInputToken, ...fetchedTokens]);
				setIsLoading(false);
			} catch (err) {
				console.error("Error fetching token list:", err);
				setError(
					"Failed to load tokens from comp. Please try again later.",
				);
				setIsLoading(false);
			}
		}

		fetchTokens();
	}, []);

	useEffect(() => {
		if (tokens.length > 0) {
			const inputCurrency = searchParams.get("inputCurrency");
			const outputCurrency = searchParams.get("outputCurrency");

			const foundInputToken =
				tokens.find((t) => t.address === inputCurrency) ||
				defaultInputToken;
			const foundOutputToken =
				tokens.find((t) => t.address === outputCurrency) ||
				defaultOutputToken;
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

    const {address} = useAccount()

    const {data: inputNeonAddress, isError: isInputError, error: inputError} = useGetSPL(inputToken.address)
    const {data: outputNeonAddress, isError: isOutputError, error: outputError} = useGetSPL(outputToken.address)

    const { data: quote, isPending } = useQuote({inputMint: inputToken.address, outputMint: outputToken.address, amount: (inputAmount * (10 ** inputToken.decimals)), slippageBps: 5, enabled: inputAmount != 0})
    const {data: swapInstructions, isError: isSwapInstructionsError, error: swapInstructionsError} = useSwapInstructions(quote!, outputNeonAddress!, address!, quote != undefined && outputNeonAddress != undefined && address!=undefined)


    const {writeContract, error: contractError, isError: isContractError } = useWriteContract()

    useEffect(() => {
        if (contractError) {
            console.log(contractError)
        }
    }, [contractError, isContractError])

	const handleSwap = () => {
        console.log("swap")
        if (isInputError) {
            console.log(inputError)
            return
        }

        if (isOutputError) {
            console.log(outputError)
            return
        }

        if (isSwapInstructionsError) {
            console.log(swapInstructionsError)
            return
        }

        console.log(inputNeonAddress)
        console.log(outputNeonAddress)

        if (quote != undefined && !isPending && inputNeonAddress != undefined && outputNeonAddress != undefined && address != undefined) {
            /*
            writeContract({
                abi: abi,
                address: inputNeonAddress,
                functionName: 'approve',
                args: ["ICSFlowMainnet", BigInt(inputAmount)]
            })
            */
            if (swapInstructions != undefined){
                const swapTransactionBuf = Buffer.from(swapInstructions, 'base64')
                const transaction =Transaction.from(swapTransactionBuf)
                const instruction = transaction.instructions[transaction.instructions.length - 1]
                console.log("instruction: ", instruction)

                console.log(instruction.programId)
                const programIdPubKey = publicKeyToBytes32(instruction.programId.toBase58())
                console.log(`programId: ${programIdPubKey}`)

                const instructionsData = prepareInstructionData(instruction.data)
                console.log(instructionsData)

                const accountsData = prepareInstructionAccounts(instruction.keys)
                console.log(accountsData)

                writeContract({
                    abi: ICSJupiterSwapAbi,
                    address: ICSFlowMainnet,
                    functionName: 'jupiterSwap',
                    args: [inputNeonAddress, outputNeonAddress, BigInt(inputAmount * (10 ** inputToken.decimals)), programIdPubKey, instructionsData, accountsData]
                })
            }
        }
    };

	const handleInputAmountChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setInputAmount(Number(e.target.value));
	};

	if (isLoading) {
		return <div>Loading tokens...</div>;
	}

	if (error) {
		return <div>{error}</div>;
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
					<SlippageSettingsModal
						onClose={() => setIsSlippage(false)}
					/>
				)}
			</div>
			<SwapInputComponent
				customBg="bg-dark"
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
				token={outputToken}
				tokens={tokens}
				amount={(Number(quote?.outAmount)?? 0) / (10**outputToken.decimals)}
				isLoading={false}
				onSelect={setOutputToken}
				defaultToken={defaultOutputToken}
                readOnly={true}
			/>
			<SwapBtn handleSwap={handleSwap} />
		</div>
	);
}
