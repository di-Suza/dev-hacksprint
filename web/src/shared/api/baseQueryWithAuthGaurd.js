import { Mutex } from "async-mutex";
import { baseQuery } from "./baseQuery";

const mutex = new Mutex();

export const baseQueryWithAuthGuard = async (
  args,
  apiInstance,
  extraOptions
) => {
  let result = await baseQuery(args, apiInstance, extraOptions);

  const state = apiInstance.getState();
  const isLoggedOut = state.auth.isLoggedOut;

  const authRoutes = [
    "/auth/login",
    "/auth/google",
    "/auth/verifyAndRegister",
    "/auth/sendOtp",
    "/auth/sendOtpForForgotPassword",
    "/auth/verifyOtpForForgotPassword",
    "/auth/updateNewPassword_ForgotPassword",
  ];

  const url = typeof args === "string" ? args : args?.url;
  const isAuthRoute = authRoutes.some((route) => url?.includes(route));

  if (isLoggedOut && !isAuthRoute) {
    return result;
  }


  if (result?.error) {
    const status = result.error.status;

    if (url?.includes("/auth/refresh")) {
      apiInstance.dispatch({ type: "auth/clearUser" });
      apiInstance.dispatch({ type: "api/resetApiState" });
      return result;
    }

    if (status === 401 && !isAuthRoute) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          const refreshResult = await baseQuery(
            { url: "/auth/refresh", method: "POST" },
            apiInstance,
            extraOptions
          );

          if (refreshResult?.data) {
            result = await baseQuery(args, apiInstance, extraOptions);
          } else {
            apiInstance.dispatch({ type: "auth/clearUser" });
            apiInstance.dispatch({ type: "api/resetApiState" });
            return result;
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();

        const newState = apiInstance.getState();
        if (newState.auth.isLoggedOut) {
          return result;
        }

        result = await baseQuery(args, apiInstance, extraOptions);
      }
    }
  }

  return result;
};
