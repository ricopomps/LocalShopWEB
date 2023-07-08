import axios from "axios";

const { REACT_APP_API_BASE_URL: baseUrl } = process.env;

export function getApi() {
  const token = sessionStorage.getItem("token");
  const api = axios.create({
    withCredentials: true,
    baseURL: baseUrl,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
  console.log("token", token);
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  return api;
}

export const API = getApi();
