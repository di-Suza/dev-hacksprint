import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../../features/auth/state/authSlice";
import { api } from "../../shared/api/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
