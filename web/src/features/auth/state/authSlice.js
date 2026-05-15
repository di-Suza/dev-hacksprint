import { createSlice } from "@reduxjs/toolkit";

import { authApi } from "../api/auth.api";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    isLoggedOut: false,
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.status = "failed";
      state.isLoggedOut = true;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.status = "succeeded";
      state.isLoggedOut = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.getMe.matchPending, (state) => {
        state.status = "loading";
      })
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isLoggedOut = false;
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        state.status = "failed";
        state.user = null;
        state.isLoggedOut = true;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;

export const selectAuthUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectIsLoggedOut = (state) => state.auth.isLoggedOut;
export const selectIsAuthenticated = (state) =>
  Boolean(state.auth.user) && !state.auth.isLoggedOut;

export default authSlice.reducer;
