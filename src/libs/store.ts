import { configureStore } from "@reduxjs/toolkit";
import swapReducer from "@/libs/features/swap/swapSlice";
import { jupiterTokenApi } from "./features/jupiter/tokenSlice";
import { jupiterPriceApi } from "./features/jupiter/priceSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      swap: swapReducer,
      [jupiterTokenApi.reducerPath]: jupiterTokenApi.reducer,
      [jupiterPriceApi.reducerPath]: jupiterPriceApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(jupiterTokenApi.middleware)
        .concat(jupiterPriceApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
