import { api } from "../../../shared/api/api";

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: (userId) => `/user/${userId}`,
      providesTags: ["ProfileUser"],
    }),
  }),
});

export const { useGetUserProfileQuery } = profileApi;
