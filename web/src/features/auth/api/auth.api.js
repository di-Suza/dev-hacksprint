import { api } from "../../../shared/api/api";
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
    sendOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/sendOtp", // for user registration
        method: "POST",
        body: data,
      }),
    }),
    verifyAndRegister: builder.mutation({
      query: (data) => ({
        url: "/auth/verifyAndRegister",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(api.util.upsertQueryData("getMe", undefined, data));
        } catch {
          //nothing to do
        }
      },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(api.util.upsertQueryData("getMe", undefined, data));
        } catch {
          //nothing to do
        }
      },
    }),
    logout: builder.mutation({
      query: (data) => ({
        url: "/auth/logout",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(api.util.resetApiState());
          dispatch(api.util.invalidateTags(["Auth"]));
        } catch {
          //
        }
      },
    }),
    googleLogin: builder.mutation({
      query: (code) => ({
        url: "/auth/google",
        method: "POST",
        body: { code },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(api.util.upsertQueryData("getMe", undefined, data));
        } catch {
          //nothing to do
        }
      },
    }),
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    // sending otp for forgot password
    sendOtpForForgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/sendOtpForForgotPassword",
        method: "POST",
        body: { email },
      }),
    }),
    // sending otp for forgot password
    verifyOtpForForgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/verifyOtpForForgotPassword",
        method: "POST",
        body: data,
      }),
    }),
    // update new Password
    updateNewPassword_ForgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/updateNewPassword_ForgotPassword",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(api.util.upsertQueryData("getMe", undefined, data));
        } catch {
          //nothing to do
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useSendOtpMutation,
  useVerifyAndRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGoogleLoginMutation,
  useSendOtpForForgotPasswordMutation,
  useVerifyOtpForForgotPasswordMutation,
  useUpdateNewPassword_ForgotPasswordMutation,
} = authApi;
