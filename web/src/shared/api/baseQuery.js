import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// const url = "https://dev-hacksprint.onrender.com/api";
const url = "http://localhost:8080/api"
export const baseQuery = fetchBaseQuery({
  baseUrl: url,
  credentials: "include",
});
