"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import walletTruncatizer from "@/libs/walletTruncatizer";
import { GoXCircleFill } from "react-icons/go";
import { IoSearchSharp } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/libs/hooks/redux/redux";
import {
  fetchSPLAddress,
  selectTokenList,
  setToken,
} from "@/libs/features/swap/swapSlice";

// if we render all tokens things get slow, so we can either set a max display
// limit or add a "virtualized" list...
const TOKEN_LIST_LEN = 100;

const TokenSelectorModal = ({
  setType,
  isLoading,
  onClose,
}: TokenSelectorModalProps) => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const allTokens = useAppSelector(selectTokenList);

  const onSelect = useCallback(
    (token: Token) => {
      dispatch(setToken({ token: token, type: setType }));
      dispatch(
        fetchSPLAddress({ solAddress: token.address, selType: setType })
      );
      onClose();
    },
    [dispatch, setType, onClose]
  );

  const filteredTokens = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return allTokens.filter(
      (token) =>
        token.name.toLowerCase().includes(lowerSearch) ||
        token.symbol.toLowerCase().includes(lowerSearch) ||
        token.address.toLowerCase().includes(lowerSearch)
    );
  }, [allTokens, search]);

  return (
    <div className="absolute z-50 top-0 left-0 w-screen h-screen flex items-center justify-center">
      <div
        className="w-full h-full bg-transparent backdrop-blur-lg"
        onClick={onClose}
      ></div>
      <div className="absolute bg-grayBg rounded-lg w-[90%] lg:w-[641px]">
        <div className="flex items-center justify-between gap-x-5 p-4">
          <div className="flex items-center gap-x-4">
            <label htmlFor="token-search" className="sr-only">
              Search token
            </label>
            <div className="text-3xl lg:text-4xl" aria-hidden="true">
              <IoSearchSharp />
            </div>
            <input
              id="token-search"
              className="bg-grayBg outline-none p-2"
              type="search"
              value={search}
              placeholder="Search token"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="text-3xl lg:text-4xl text-grayText"
            onClick={onClose}
            aria-label="Close token selector"
            type="button"
          >
            <GoXCircleFill />
          </button>
        </div>
        <div className="overflow-y-auto h-[80vh]">
          {isLoading ? (
            <div className="text-center">Loading tokens...</div>
          ) : filteredTokens.length > 0 ? (
            filteredTokens.slice(0, TOKEN_LIST_LEN).map((token) => (
              <button
                key={token.address}
                className="flex items-center justify-between w-full text-left p-2 hover:bg-grayText/30 rounded"
                onClick={() => onSelect(token)}
              >
                <div className="flex items-center gap-x-2">
                  <div className="ml-2 w-11 h-11">
                    {token.logoURI && (
                      <Image
                        className="w-full h-full"
                        src={token.logoURI}
                        width={46}
                        height={46}
                        alt={`${token.name} logo`}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-bold">{token.symbol}</div>
                    <div className="text-xs text-gray-500">
                      {walletTruncatizer(token.address)}
                    </div>
                    <div className="text-sm text-gray-500">{token.name}</div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center">No tokens available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenSelectorModal;
