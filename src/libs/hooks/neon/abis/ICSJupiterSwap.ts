export const ICSJupiterSwapAbi = [
  {
    inputs: [
      { internalType: "bytes32", name: "_NEON_EVM_PROGRAM", type: "bytes32" },
      { internalType: "bytes32", name: "_ORCA_PROGRAM", type: "bytes32" },
      { internalType: "bytes32", name: "_JUPITER_PROGRAM", type: "bytes32" },
      { internalType: "bytes32", name: "_RAYDIUM_PROGRAM", type: "bytes32" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "InvalidInstruction", type: "error" },
  { inputs: [], name: "InvalidSolanaAccount", type: "error" },
  { inputs: [], name: "InvalidSolanaAccountParameters", type: "error" },
  { inputs: [], name: "InvalidSolanaProgram", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "response",
        type: "bytes",
      },
    ],
    name: "ComposabilityResponse",
    type: "event",
  },
  {
    inputs: [],
    name: "ASSOCIATED_TOKEN_PROGRAM",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "CALL_SOLANA",
    outputs: [
      { internalType: "contract ICallSolana", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "JUPITER_PROGRAM",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NEON_EVM_PROGRAM",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ORCA_PROGRAM",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RAYDIUM_PROGRAM",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKEN_PROGRAM",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "address", name: "tokenOut", type: "address" },
      { internalType: "uint64", name: "amount", type: "uint64" },
      { internalType: "bytes32[]", name: "programIds", type: "bytes32[]" },
      { internalType: "bytes[]", name: "instructions", type: "bytes[]" },
      { internalType: "bytes[]", name: "accountsDatas", type: "bytes[]" },
    ],
    name: "batchOrcaRaydiumSwap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "evm_address", type: "address" }],
    name: "getNeonAddress",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "address", name: "tokenOut", type: "address" },
      { internalType: "uint64", name: "amount", type: "uint64" },
      { internalType: "bytes32", name: "programId", type: "bytes32" },
      { internalType: "bytes", name: "instruction", type: "bytes" },
      { internalType: "bytes", name: "accountsData", type: "bytes" },
    ],
    name: "jupiterSwap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "address", name: "tokenOut", type: "address" },
      { internalType: "uint64", name: "amount", type: "uint64" },
      { internalType: "bytes32", name: "programId", type: "bytes32" },
      { internalType: "bytes", name: "instruction", type: "bytes" },
      { internalType: "bytes", name: "accountsData", type: "bytes" },
    ],
    name: "orcaSwap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "address", name: "tokenOut", type: "address" },
      { internalType: "uint64", name: "amount", type: "uint64" },
      { internalType: "bytes32", name: "programId", type: "bytes32" },
      { internalType: "bytes", name: "instruction", type: "bytes" },
      { internalType: "bytes", name: "accountsData", type: "bytes" },
    ],
    name: "orcaTwoHopSwap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenIn", type: "address" },
      { internalType: "address", name: "tokenOut", type: "address" },
      { internalType: "uint64", name: "amount", type: "uint64" },
      { internalType: "bytes32", name: "programId", type: "bytes32" },
      { internalType: "bytes", name: "instruction", type: "bytes" },
      { internalType: "bytes", name: "accountsData", type: "bytes" },
    ],
    name: "raydiumSwap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
