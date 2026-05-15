import { api } from "../../../shared/api/api";
import { setUser } from "../../auth/state/authSlice";

export const blogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createBlog: builder.mutation({
      query: (data) => ({
        url: "/blog",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData("getMyBlogs", undefined, (draft) => {
              if (draft?.blogs) {
                draft.blogs.unshift(data.blog);
              }
            }),
          );
          dispatch(
            api.util.updateQueryData("getMe", undefined, (draft) => {
              if (draft?.user) {
                draft.user.blogsCount = (draft.user.blogsCount || 0) + 1;
              }
            }),
          );

          const currentUser = getState().auth.user;
          if (currentUser) {
            dispatch(
              setUser({
                user: {
                  ...currentUser,
                  blogsCount: (currentUser.blogsCount || 0) + 1,
                },
              }),
            );
          }
        } catch {
          // cache update not needed on failure
        }
      },
    }),
    getMyBlogs: builder.query({
      query: () => "/blog/my",
      providesTags: ["Blog"],
    }),
    getBlogById: builder.query({
      query: (id) => `/blog/${id}`,
      providesTags: ["Blog"],
    }),
    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `/blog/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData("getMyBlogs", undefined, (draft) => {
              if (draft?.blogs) {
                const index = draft.blogs.findIndex((blog) => blog._id === id);
                if (index !== -1) {
                  draft.blogs[index] = data.blog;
                }
              }
            }),
          );
          dispatch(
            api.util.updateQueryData("getBlogById", id, (draft) => {
              if (draft?.blog) {
                draft.blog = data.blog;
              }
            }),
          );
        } catch {
          // cache update not needed on failure
        }
      },
    }),
    updateBlogPublishStatus: builder.mutation({
      query: ({ id, isPublished }) => ({
        url: `/blog/${id}/publish-status`,
        method: "PATCH",
        body: { isPublished },
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData("getMyBlogs", undefined, (draft) => {
              if (draft?.blogs) {
                const index = draft.blogs.findIndex((blog) => blog._id === id);
                if (index !== -1) {
                  draft.blogs[index] = data.blog;
                }
              }
            }),
          );
          dispatch(
            api.util.updateQueryData("getBlogById", id, (draft) => {
              if (draft?.blog) {
                draft.blog = data.blog;
              }
            }),
          );
        } catch {
          // cache update not needed on failure
        }
      },
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blog/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const blogsPatch = dispatch(
          api.util.updateQueryData("getMyBlogs", undefined, (draft) => {
            if (draft?.blogs) {
              draft.blogs = draft.blogs.filter((blog) => blog._id !== id);
            }
          }),
        );
        const userPatch = dispatch(
          api.util.updateQueryData("getMe", undefined, (draft) => {
            if (draft?.user) {
              draft.user.blogsCount = Math.max((draft.user.blogsCount || 0) - 1, 0);
            }
          }),
        );

        const currentUser = getState().auth.user;
        if (currentUser) {
          dispatch(
            setUser({
              user: {
                ...currentUser,
                blogsCount: Math.max((currentUser.blogsCount || 0) - 1, 0),
              },
            }),
          );
        }

        try {
          await queryFulfilled;
        } catch {
          blogsPatch.undo();
          userPatch.undo();
          if (currentUser) {
            dispatch(setUser({ user: currentUser }));
          }
        }
      },
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogByIdQuery,
  useGetMyBlogsQuery,
  useUpdateBlogMutation,
  useUpdateBlogPublishStatusMutation,
} = blogApi;
