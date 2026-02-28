import axios from "axios";

const SUPABASE_URL = "https://jmbrohwuhkayjpcincbz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CAoBNKLAw9p1Y7hSXdfP_w_W4gFzYmz";

const api = axios.create({
  baseURL: `${SUPABASE_URL}/auth/v1`,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;