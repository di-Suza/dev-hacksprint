import { api } from "../../../shared/api/api";

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (data) => ({
        url: "/project",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData("getMyProjects", undefined, (draft) => {
              if (draft?.projects) {
                draft.projects.unshift(data.project);
              }
            }),
          );
        } catch {
          // cache update not needed on failure
        }
      },
    }),
    getMyProjects: builder.query({
      query: () => "/project/my",
      providesTags: ["Project"],
    }),
    getProjectById: builder.query({
      query: (id) => `/project/${id}`,
      providesTags: ["Project"],
    }),
    updateProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `/project/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData("getMyProjects", undefined, (draft) => {
              if (draft?.projects) {
                const index = draft.projects.findIndex((project) => project._id === id);
                if (index !== -1) {
                  draft.projects[index] = data.project;
                }
              }
            }),
          );
          dispatch(
            api.util.updateQueryData("getProjectById", id, (draft) => {
              if (draft?.project) {
                draft.project = data.project;
              }
            }),
          );
        } catch {
          // cache update not needed on failure
        }
      },
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/project/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          api.util.updateQueryData("getMyProjects", undefined, (draft) => {
            if (draft?.projects) {
              draft.projects = draft.projects.filter((project) => project._id !== id);
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetMyProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} = projectApi;
