import { configureStore } from "@reduxjs/toolkit";
import swapReducer from "@/libs/features/swap/swapSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      swap: swapReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
