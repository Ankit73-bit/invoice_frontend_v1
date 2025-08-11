import axios from "axios";

export const api = axios.create({
  // baseURL: "https://invoice-backend-v1-jjb0.onrender.com/api",
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // for cookies
});
