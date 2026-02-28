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