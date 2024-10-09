import { defaultInputToken, defaultOutputToken } from "@/libs/defaultToken";
import { ERC20ForSplFactoryAbi } from "@/libs/hooks/neon/abis/ERC20ForSplFactory";
import { ERC20ForSplFactoryAddress } from "@/libs/hooks/neon/constants";
import { QuoteResponse } from "@jup-ag/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "viem";
import { readContract } from "@wagmi/core";
import { publicKeyToBytes32 } from "@/libs/hooks/neon/utils";
import { config } from "@/providers/rainbowkitprovider";
import { ZeroAddress } from "ethers";

export interface SwapToken extends Token {
  humanAmount?: number;
  weiAmount?: number;
  userBalance?: number;

  evm?: Address;
  svm: string;
}

export interface SwapState {
  quote?: QuoteResponse;
  inputToken: SwapToken;
  outputToken: SwapToken;
  tokenList: Token[];
  slippage: number;
  feesPct: number;
}

const initialState: SwapState = {
  inputToken: {
    svm: defaultInputToken.address,
    ...defaultInputToken,
  },
  outputToken: {
    svm: defaultOutputToken.address,
    ...defaultOutputToken,
  },
  slippage: 0.5,
  feesPct: 0,
  tokenList: [],
};

export const fetchSPLAddress = createAsyncThunk(
  "swap/fetchSPLAddress",
  async ({
    solAddress,
    selType,
  }: {
    solAddress: string;
    selType: "input" | "output";
  }) => {
    try {
      const data = await readContract(config, {
        address: ERC20ForSplFactoryAddress,
        functionName: "getErc20ForSpl",
        abi: ERC20ForSplFactoryAbi,
        args: [publicKeyToBytes32(solAddress)],
      });

      if (data == ZeroAddress) {
        throw "No equivalent SPL Token found";
      }

      return { data, selType };
    } catch (error) {
      console.error(error);
    }
  },
);

export const swapSlice = createSlice({
  name: "swap",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSPLAddress.fulfilled, (state, action) => {
      switch (action.meta.arg.selType) {
        case "input":
          state.inputToken.evm = action.payload?.data;
          return;
        case "output":
          state.outputToken.evm = action.payload?.data;
          return;
      }
    });
    builder.addCase(fetchSPLAddress.rejected, (state, action) => {
      console.log("rejected: ", action.payload);
    });
  },
  reducers: {
    mergeTokenList: (state, action: PayloadAction<Token[]>) => {
      state.tokenList = [...new Set([...state.tokenList, ...action.payload])];
    },
    setTokenList: (state, action: PayloadAction<Token[]>) => {
      state.tokenList = action.payload;
    },
    setToken: (
      state,
      action: PayloadAction<{ token: Token; type: "input" | "output" }>,
    ) => {
      const ptoken = action.payload.token;

      const swapToken: SwapToken = {
        svm: ptoken.address,
        ...ptoken,
      };
      state.quote = undefined;
      state.outputToken.humanAmount = undefined;
      state.outputToken.weiAmount = undefined;

      switch (action.payload.type) {
        case "input":
          state.inputToken = swapToken;
          return;
        case "output":
          state.outputToken = swapToken;
          return;
      }
    },
    swapInputOutput: (state) => {
      [state.inputToken, state.outputToken] = [
        state.outputToken,
        state.inputToken,
      ];
      state.quote = undefined;
      state.outputToken.humanAmount = undefined;
      state.outputToken.weiAmount = undefined;
    },
    setUserbalance: (
      state,
      action: PayloadAction<{ amount: number; type: "input" | "output" }>,
    ) => {
      switch (action.payload.type) {
        case "input":
          state.inputToken.userBalance = Number(
            action.payload.amount / 10 ** state.inputToken.decimals,
          );
          return;
        case "output":
          state.outputToken.userBalance = Number(
            action.payload.amount / 10 ** state.outputToken.decimals,
          );
          return;
      }
    },
    setInputTokenAmount: (state, action: PayloadAction<number | undefined>) => {
      const wei =
        action.payload && action.payload * 10 ** state.inputToken.decimals;

      state.inputToken.humanAmount = action.payload;
      state.inputToken.weiAmount = wei;
      state.quote = undefined;
      state.outputToken.humanAmount = undefined;
      state.outputToken.weiAmount = undefined;
    },
    setOutputTokenAmount: (state, action: PayloadAction<QuoteResponse>) => {
      const wei = Number(action.payload.outAmount);

      state.outputToken.humanAmount = wei / 10 ** state.outputToken.decimals;
      state.outputToken.weiAmount = wei;
      state.quote = action.payload;
    },
    setEvmAddress: (
      state,
      action: PayloadAction<{ address: Address; type: "input" | "output" }>,
    ) => {
      switch (action.payload.type) {
        case "input":
          state.inputToken.evm = action.payload.address;
          return;
        case "output":
          state.outputToken.evm = action.payload.address;
          return;
      }
    },
    setSlippage: (state, action: PayloadAction<number>) => {
      state.slippage = action.payload;
      state.quote = undefined;
      state.outputToken.humanAmount = undefined;
      state.outputToken.weiAmount = undefined;
    },
  },
  selectors: {
    selectInputToken: (state) => state.inputToken,
    selectOutputToken: (state) => state.outputToken,
    selectUserInputTokenBalance: (state) => state.inputToken.userBalance,
    selectUserOutputTokenBalance: (state) => state.outputToken.userBalance,
    selectTokenList: (state) => state.tokenList,
    selectQuote: (state) => state.quote,
    selectSlippage: (state) => state.slippage,
  },
});

export const {
  setInputTokenAmount,
  setToken,
  setOutputTokenAmount,
  setEvmAddress,
  setUserbalance,
  setTokenList,
  swapInputOutput,
  setSlippage,
} = swapSlice.actions;

export const {
  selectInputToken,
  selectOutputToken,
  selectTokenList,
  selectQuote,
  selectSlippage,
} = swapSlice.selectors;

export default swapSlice.reducer;
