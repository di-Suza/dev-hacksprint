import { api } from "../../../shared/api/api";

function buildFeedEndpoint(builder, url) {
  return builder.query({
    query: ({ limit = 10, page = 1 }) => `${url}?page=${page}&limit=${limit}`,
    serializeQueryArgs: () => undefined,
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
      return currentArg?.page !== previousArg?.page;
    },
    providesTags: ["Feed"],
  });
}

export const feedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjectFeed: buildFeedEndpoint(builder, "/feed/projects"),
    getBlogFeed: buildFeedEndpoint(builder, "/feed/blogs"),
  }),
});

export const { useGetBlogFeedQuery, useGetProjectFeedQuery } = feedApi;
