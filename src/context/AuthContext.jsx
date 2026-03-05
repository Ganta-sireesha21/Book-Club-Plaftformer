import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, email, avatar_url")
      .eq("user_id", userId)
      .single();
      console.log("Profile Data:", data);

    if (data) setProfile(data);
  }, []);

  const checkAdmin = useCallback(async (userId) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!!data);
  }, []);

  useEffect(() => {

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {

          setTimeout(() => {
            fetchProfile(session.user.id);
            checkAdmin(session.user.id);
          }, 0);

        } else {
          setProfile(null);
          setIsAdmin(false);
        }

        setLoading(false);
      });

    supabase.auth.getSession().then(({ data: { session } }) => {

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id);
        checkAdmin(session.user.id);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();

  }, [fetchProfile, checkAdmin]);

  const signUp = useCallback(async (email, password, displayName) => {

  try {

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: displayName
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };

  } catch (err) {
    return { error: "Signup failed. Please try again." };
  }

}, []);

  const signIn = useCallback(async (email, password) => {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { error: error?.message ?? null };

  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email) => {

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    return { error: error?.message ?? null };

  }, []);

  const updatePassword = useCallback(async (password) => {

    const { error } = await supabase.auth.updateUser({
      password
    });

    return { error: error?.message ?? null };

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        profile,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword
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