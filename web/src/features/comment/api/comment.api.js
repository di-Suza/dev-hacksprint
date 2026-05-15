import { api } from "../../../shared/api/api";

function patchContentCommentCount(dispatch, contentType, contentId, commentCount) {
  const endpointName = contentType === "project" ? "getProjectById" : "getBlogById";
  const dataKey = contentType === "project" ? "project" : "blog";
  const listEndpoint = contentType === "project" ? "getMyProjects" : "getMyBlogs";
  const listKey = contentType === "project" ? "projects" : "blogs";
  const feedEndpoint = contentType === "project" ? "getProjectFeed" : "getBlogFeed";

  dispatch(
    api.util.updateQueryData(endpointName, contentId, (draft) => {
      if (draft?.[dataKey]) {
        draft[dataKey].commentCount = commentCount;
      }
    }),
  );

  dispatch(
    api.util.updateQueryData(listEndpoint, undefined, (draft) => {
      if (draft?.[listKey]) {
        const content = draft[listKey].find((item) => item._id === contentId);
        if (content) {
          content.commentCount = commentCount;
        }
      }
    }),
  );

  dispatch(
    api.util.updateQueryData(feedEndpoint, undefined, (draft) => {
      if (draft?.items) {
        const content = draft.items.find((item) => item._id === contentId);
        if (content) {
          content.commentCount = commentCount;
        }
      }
    }),
  );
}

function getQueryArg({ contentId, contentType }) {
  return { contentId, contentType };
}

export const commentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: ({ contentId, contentType }) =>
        `/comment?contentId=${contentId}&contentType=${contentType}`,
      providesTags: ["Comment"],
    }),
    createComment: builder.mutation({
      query: (data) => ({
        url: "/comment",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const currentUser = getState().auth.user;
        const queryArg = getQueryArg(arg);
        const tempId = `temp-${Date.now()}`;
        const previousCount = arg.currentCommentCount || 0;
        const optimisticCount = previousCount + 1;

        const commentsPatch = dispatch(
          api.util.updateQueryData("getComments", queryArg, (draft) => {
            if (draft?.comments) {
              draft.comments.unshift({
                _id: tempId,
                canDelete: true,
                comment: arg.comment,
                content: arg.contentId,
                contentType: arg.contentType,
                createdAt: new Date().toISOString(),
                isOptimistic: true,
                user: currentUser
                  ? {
                      _id: currentUser._id,
                      profilePicture: currentUser.profilePicture,
                      userName: currentUser.userName,
                    }
                  : null,
              });
            }
          }),
        );

        patchContentCommentCount(
          dispatch,
          arg.contentType,
          arg.contentId,
          optimisticCount,
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData("getComments", queryArg, (draft) => {
              if (draft?.comments) {
                const index = draft.comments.findIndex(
                  (comment) => comment._id === tempId,
                );
                if (index !== -1) {
                  draft.comments[index] = data.comment;
                }
              }
            }),
          );
          patchContentCommentCount(
            dispatch,
            arg.contentType,
            arg.contentId,
            data.commentCount,
          );
        } catch {
          commentsPatch.undo();
          patchContentCommentCount(
            dispatch,
            arg.contentType,
            arg.contentId,
            previousCount,
          );
        }
      },
    }),
    deleteComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `/comment/${commentId}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const queryArg = getQueryArg(arg);
        const previousCount = arg.currentCommentCount || 0;
        const optimisticCount = Math.max(previousCount - 1, 0);

        const commentsPatch = dispatch(
          api.util.updateQueryData("getComments", queryArg, (draft) => {
            if (draft?.comments) {
              draft.comments = draft.comments.filter(
                (comment) => comment._id !== arg.commentId,
              );
            }
          }),
        );

        patchContentCommentCount(
          dispatch,
          arg.contentType,
          arg.contentId,
          optimisticCount,
        );

        try {
          const { data } = await queryFulfilled;
          patchContentCommentCount(
            dispatch,
            arg.contentType,
            arg.contentId,
            data.commentCount,
          );
        } catch {
          commentsPatch.undo();
          patchContentCommentCount(
            dispatch,
            arg.contentType,
            arg.contentId,
            previousCount,
          );
        }
      },
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
} = commentApi;
