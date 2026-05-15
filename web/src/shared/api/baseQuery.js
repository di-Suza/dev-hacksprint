import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const productionURL = "https://dev-hacksprint.onrender.com/api";
// const localURL = "http://localhost:8080/api"
export const baseQuery = fetchBaseQuery({
  baseUrl: productionURL,
  credentials: "include",
});
