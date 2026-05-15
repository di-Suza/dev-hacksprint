import { api } from "../../../shared/api/api";

function patchContentCache(dispatch, contentType, contentId, payload) {
  const endpointName = contentType === "project" ? "getProjectById" : "getBlogById";
  const dataKey = contentType === "project" ? "project" : "blog";
  const listEndpoint = contentType === "project" ? "getMyProjects" : "getMyBlogs";
  const listKey = contentType === "project" ? "projects" : "blogs";
  const feedEndpoint = contentType === "project" ? "getProjectFeed" : "getBlogFeed";

  dispatch(
    api.util.updateQueryData(endpointName, contentId, (draft) => {
      if (draft?.[dataKey]) {
        draft[dataKey].isLiked = payload.isLiked;
        draft[dataKey].likeCount = payload.likeCount;
      }
    }),
  );

  dispatch(
    api.util.updateQueryData(listEndpoint, undefined, (draft) => {
      if (draft?.[listKey]) {
        const item = draft[listKey].find((content) => content._id === contentId);
        if (item) {
          item.likeCount = payload.likeCount;
        }
      }
    }),
  );

  dispatch(
    api.util.updateQueryData(feedEndpoint, undefined, (draft) => {
      if (draft?.items) {
        const item = draft.items.find((content) => content._id === contentId);
        if (item) {
          item.isLiked = payload.isLiked;
          item.likeCount = payload.likeCount;
        }
      }
    }),
  );
}

export const likeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    likeContent: builder.mutation({
      query: (data) => ({
        url: "/like",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          patchContentCache(dispatch, arg.contentType, arg.contentId, data);
        } catch {
          // cache update not needed on failure
        }
      },
    }),
    unlikeContent: builder.mutation({
      query: (data) => ({
        url: "/like",
        method: "DELETE",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          patchContentCache(dispatch, arg.contentType, arg.contentId, data);
        } catch {
          // cache update not needed on failure
        }
      },
    }),
  }),
});

export const { useLikeContentMutation, useUnlikeContentMutation } = likeApi;
