import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthGuard } from "./baseQueryWithAuthGaurd";

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthGuard,
  tagTypes: [
    "Auth",
    "Project",
    "Blog",
    "Comment",
    "Feed",
    "ProfileUser",
    "Followers",
    "Following",
  ],
  endpoints: () => ({}),
});
