import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

import {
  loginUser,
  registerUser,
  resetPasswordUser,
  updatePasswordUser,
} from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(false);

  /* 🔐 Login */
  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);

      const { access_token, user } = res.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setToken(access_token);

      return { error: null };
    } catch (error) {
      return {
        error:
          error.response?.data?.error_description ||
          "Login failed",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /* 🆕 Register */
  const signUp = useCallback(async (email, password) => {
    setLoading(true);
    try {
      await registerUser(email, password);
      return { error: null };
    } catch (error) {
      return {
        error:
          error.response?.data?.error_description ||
          "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /* 📩 Send Reset Email */
  const resetPassword = useCallback(async (email) => {
    try {
      await resetPasswordUser(email);
      return { error: null };
    } catch (error) {
      return {
        error:
          error.response?.data?.error_description ||
          "Reset failed",
      };
    }
  }, []);

  /* 🔁 Update Password */
  const updatePassword = useCallback(async (password) => {
    try {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");

      if (!accessToken) {
        return { error: "Invalid recovery session" };
      }

      await updatePasswordUser(accessToken, password);

      // Clear hash
      window.location.hash = "";

      return { error: null };
    } catch (error) {
      return {
        error:
          error.response?.data?.error_description ||
          "Password update failed",
      };
    }
  }, []);

  /* 🚪 Logout */
  const signOut = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}