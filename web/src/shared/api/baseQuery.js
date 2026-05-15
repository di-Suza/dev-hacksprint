import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url =
  import.meta.env.VITE_API_URL || "https://dev-hacksprint.onrender.com/api";

export const baseQuery = fetchBaseQuery({
  baseUrl: url,
  credentials: "include",
});
