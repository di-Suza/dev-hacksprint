import { setUser } from "../../auth/state/authSlice";
import { api } from "../../../shared/api/api";
export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updatePassword: builder.mutation({
      query: (data) => ({
        url: "/user/updatePassword",
        method: "POST",
        body: data,
      }),
    }),
    // profile picture only
    updateProfilePicture: builder.mutation({
      query: (userData) => ({
        url: "/user/updateProfilePicture",
        method: "PATCH",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const { profilePicture } = data.updatedData;
          const currentUser = getState().auth.user;
          dispatch(
            setUser({
              user: {
                ...currentUser,
                profilePicture,
              },
            }),
          );

          dispatch(
            api.util.updateQueryData("getMe", undefined, (draft) => {
              if (draft?.user) {
                draft.user.profilePicture = profilePicture;
              }
            }),
          );
        } catch {
          //
        }
      },
    }),

    // userName, about and headline
    updateGeneralInfo: builder.mutation({
      query: (userData) => ({
        url: "/user/updateGeneralInfo",
        method: "PATCH",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const { userName, about, headline } = data.updatedData;
          const currentUser = getState().auth.user;
          dispatch(
            setUser({
              user: {
                ...currentUser,
                userName,
                headline,
                about,
              },
            }),
          );
          dispatch(
            api.util.updateQueryData("getMe", undefined, (draft) => {
              if (draft?.user) {
                draft.user.userName = userName;
                draft.user.headline = headline;
                draft.user.about = about;
              }
            }),
          );
        } catch {
          //nothing to do
        }
      },
    }),

    // professional [skills, experience, education, interests, language]
    updateProfessionalInfo: builder.mutation({
      query: (userData) => ({
        url: "/user/updateProfessionalInfo",
        method: "PATCH",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const { updatedData } = data;
          const currentUser = getState().auth.user;
          dispatch(
            setUser({
              user: {
                ...currentUser,
                ...updatedData,
              },
            }),
          );
          dispatch(
            api.util.updateQueryData("getMe", undefined, (draft) => {
              if (draft?.user) {
                Object.assign(draft.user, updatedData);
              }
            }),
          );
        } catch {
          //nothing to do
        }
      },
    }),

    updateSocialLinks: builder.mutation({
      query: (userData) => ({
        url: "/user/updateSocialLinks",
        method: "PATCH",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const { updatedData } = data;
          const currentUser = getState().auth.user;
          dispatch(
            setUser({
              user: {
                ...currentUser,
                socialLinks: updatedData,
              },
            }),
          );
          dispatch(
            api.util.updateQueryData("getMe", undefined, (draft) => {
              if (draft?.user) {
                draft.user.socialLinks = updatedData;
              }
            }),
          );
        } catch {
          //nothing to do
        }
      },
    }),
    
    // it's for getting data of other users
    getProfileUser: builder.query({
      query: (id) => `/user/getProfileUser/${id}`,
      providesTags: ["ProfileUser"],
    }),

    // Follow and Unfollow mutations with optimistic updates
    followUser: builder.mutation({
      query: (userId) => ({
        url: `/user/followUser/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["Followers", "Following"],

      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        //other user
        const followerCountIncrease = dispatch(
          api.util.updateQueryData("getProfileUser", id, (draft) => {
            if (draft) {
              if (draft.profileUser) {
                draft.profileUser.followersCount += 1;
                draft.profileUser.isFollowed = true;
              }
            }
          }),
        );
        //current user
        const followingCountIncrease = dispatch(
          api.util.updateQueryData("getMe", undefined, (draft) => {
            if (draft) {
              if (draft.user) {
                draft.user.followingCount += 1;
              }
            }
          }),
        );
        const state = getState();
        const currentUser = state.auth.user;
        dispatch(
          setUser({
            user: {
              ...currentUser,
              followingCount: currentUser.followingCount + 1,
            },
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          followerCountIncrease.undo();
          followingCountIncrease.undo();
        }
      },
    }),
    unfollowUser: builder.mutation({
      query: (userId) => ({
        url: `/user/unfollowUser/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Followers", "Following"],
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        //other user
        const followerCountDecrease = dispatch(
          api.util.updateQueryData("getProfileUser", id, (draft) => {
            if (draft) {
              if (draft.profileUser) {
                draft.profileUser.followersCount -= 1;
                draft.profileUser.isFollowed = false;
              }
            }
          }),
        );
        //current user
        const followingCountDecrease = dispatch(
          api.util.updateQueryData("getMe", undefined, (draft) => {
            if (draft) {
              if (draft.user) {
                draft.user.followingCount -= 1;
              }
            }
          }),
        );
        const state = getState();
        const currentUser = state.auth.user;
        dispatch(
          setUser({
            user: {
              ...currentUser,
              followingCount: currentUser.followingCount - 1,
            },
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          followerCountDecrease.undo();
          followingCountDecrease.undo();
        }
      },
    }),
    // Get followers and following with pagination and cache merging
    getFollowers: builder.query({
      query: ({ userId, page }) => `/user/getFollowers/${userId}?page=${page}`,
      providesTags: ["Followers"],

      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        return `${endpointName}_${queryArgs.userId}`;
      },

      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          if (currentCache?.followers?.length > 0) {
            const existingIds = new Set(
              currentCache.followers.map((p) => p._id),
            );
            const uniqueNewItems = newItems.followers.filter(
              (p) => !existingIds.has(p._id),
            );

            currentCache.followers.push(...uniqueNewItems);
            currentCache.hasMore = newItems.hasMore;
            return currentCache;
          }
          return newItems;
        }

        const existingIds = new Set(currentCache.followers.map((p) => p._id));
        const uniqueNewItems = newItems.followers.filter(
          (p) => !existingIds.has(p._id),
        );

        currentCache.followers.push(...uniqueNewItems);
        currentCache.hasMore = newItems.hasMore;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getFollowing: builder.query({
      query: ({ userId, page }) => `/user/getFollowing/${userId}?page=${page}`,
      providesTags: ["Following"],

      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        return `${endpointName}_${queryArgs.userId}`;
      },

      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          if (currentCache?.following?.length > 0) {
            const existingIds = new Set(
              currentCache.following.map((p) => p._id),
            );
            const uniqueNewItems = newItems.following.filter(
              (p) => !existingIds.has(p._id),
            );

            currentCache.following.push(...uniqueNewItems);
            currentCache.hasMore = newItems.hasMore;
            return currentCache;
          }
          return newItems;
        }

        const existingIds = new Set(currentCache.following.map((p) => p._id));
        const uniqueNewItems = newItems.following.filter(
          (p) => !existingIds.has(p._id),
        );

        currentCache.following.push(...uniqueNewItems);
        currentCache.hasMore = newItems.hasMore;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const {
  useUpdatePasswordMutation,
  useUpdateProfilePictureMutation,
  useUpdateGeneralInfoMutation,
  useUpdateProfessionalInfoMutation,
  useUpdateSocialLinksMutation,
  useGetProfileUserQuery,
  useFollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useUnfollowUserMutation,
} = userApi;
