'use client'

import { useAppDispatch, useAppSelector } from "@/libs/hooks/redux/redux"
import SwapInputComponent from "./SwapInputComponent"
import { selectOutputToken, setToken } from "@/libs/features/swap/swapSlice"
import { defaultOutputToken } from "@/libs/defaultToken"

export const SwapOutput = () => {
    const dispatch = useAppDispatch()

    const outputToken = useAppSelector(selectOutputToken)

    const handleSelect = (selToken: Token) => {
        dispatch(setToken({token: selToken, type: "output"}))
    }

    return (
        <SwapInputComponent
        customBg="bg-lightGray mb-[34px]"
        setType="output"
        balance={outputToken.userBalance}
        onSelect={handleSelect}
        token={outputToken}
        amount={outputToken.humanAmount}
        isLoading={false}
        defaultToken={defaultOutputToken}
        readOnly={true}
        />
    )
}

export default SwapOutput
