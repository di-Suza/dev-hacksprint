import { api } from "../../../shared/api/api";
import { setUser } from "../../auth/state/authSlice";

function patchFollowCaches(dispatch, profileUserId, payload) {
  dispatch(
    api.util.updateQueryData("getUserProfile", profileUserId, (draft) => {
      if (draft?.user?.user) {
        draft.user.user.isFollowed = payload.isFollowed;
        draft.user.user.followersCount = payload.followersCount;
      }
    }),
  );

  dispatch(
    api.util.updateQueryData("getMe", undefined, (draft) => {
      if (draft?.user) {
        draft.user.followingCount = payload.followingCount;
      }
    }),
  );
}

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: (userId) => `/user/${userId}`,
      providesTags: ["ProfileUser"],
    }),
    getFollowers: builder.query({
      query: ({ page = 1, userId }) =>
        `/user/${userId}/followers?page=${page}&limit=20`,
      providesTags: ["Followers"],
    }),
    getFollowing: builder.query({
      query: ({ page = 1, userId }) =>
        `/user/${userId}/following?page=${page}&limit=20`,
      providesTags: ["Following"],
    }),
    followProfileUser: builder.mutation({
      query: (userId) => ({
        url: `/user/${userId}/follow`,
        method: "POST",
      }),
      async onQueryStarted(userId, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          patchFollowCaches(dispatch, userId, data);

          const currentUser = getState().auth.user;
          if (currentUser) {
            dispatch(
              setUser({
                user: {
                  ...currentUser,
                  followingCount: data.followingCount,
                },
              }),
            );
          }
        } catch {
          // cache update not needed on failure
        }
      },
    }),
    unfollowProfileUser: builder.mutation({
      query: (userId) => ({
        url: `/user/${userId}/follow`,
        method: "DELETE",
      }),
      async onQueryStarted(userId, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          patchFollowCaches(dispatch, userId, data);

          const currentUser = getState().auth.user;
          if (currentUser) {
            dispatch(
              setUser({
                user: {
                  ...currentUser,
                  followingCount: data.followingCount,
                },
              }),
            );
          }
        } catch {
          // cache update not needed on failure
        }
      },
    }),
  }),
});

export const {
  useFollowProfileUserMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useGetUserProfileQuery,
  useUnfollowProfileUserMutation,
} = profileApi;
