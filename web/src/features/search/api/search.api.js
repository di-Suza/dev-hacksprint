import { api } from "../../../shared/api/api";

function buildSearchEndpoint(builder, url) {
  return builder.query({
    query: ({ query, limit = 10, page = 1 }) =>
      `${url}?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    serializeQueryArgs: ({ queryArgs }) => queryArgs,
    merge: (currentCache, newData, { arg }) => {
      if (arg.page === 1 || !currentCache?.items) {
        return newData;
      }

      const existingIds = new Set(currentCache.items.map((item) => item._id));
      const nextItems = newData.items.filter((item) => !existingIds.has(item._id));

      currentCache.items.push(...nextItems);
      currentCache.hasMore = newData.hasMore;
      currentCache.page = newData.page;
      currentCache.totalItems = newData.totalItems;
    },
    forceRefetch({ currentArg, previousArg }) {
      return (
        currentArg?.query !== previousArg?.query ||
        currentArg?.page !== previousArg?.page
      );
    },
    providesTags: ["Search"],
  });
}

export const searchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchUsers: buildSearchEndpoint(builder, "/search/users"),
    searchBlogs: buildSearchEndpoint(builder, "/search/blogs"),
    searchProjects: buildSearchEndpoint(builder, "/search/projects"),
  }),
});

export const {
  useSearchUsersQuery,
  useSearchBlogsQuery,
  useSearchProjectsQuery,
} = searchApi;
