import Meetings from "@/pages/Meetings";
import api from "./api";

/* 🔐 Login */
export const loginUser = (email, password) => {
  return api.post("/token?grant_type=password", {
    email,
    password,
  });
};

/* 🆕 Register */
export const registerUser = (email, password) => {
  return api.post("/signup", {
    email,
    password,
  });
};

/* 📩 Send Reset Email */
export const resetPasswordUser = (email) => {
  return api.post("/recover", {
    email,
  });
};

/* 🔁 Update Password After Recovery */
export const updatePasswordUser = (token, password) => {
  return api.put(
    "/user",
    { password },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const updateMeetings = (token, Meetings) => {
api.get("/rest/v1/meetings", {
  headers: {
    Authorization: `Bearer ${token}`,
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
});
}