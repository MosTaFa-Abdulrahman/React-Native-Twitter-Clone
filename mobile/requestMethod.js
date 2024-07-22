import axios from "axios";

const BASE_URL = "http://192.168.1.7:5000/api/";

export const makeRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
