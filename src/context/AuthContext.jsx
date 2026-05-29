import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const persisted = window.localStorage.getItem("toyota_auth_user");
      return persisted ? JSON.parse(persisted) : null;
    } catch (error) {
      console.warn("Failed to read auth session from localStorage:", error);
      return null;
    }
  });

  const login = (username, password) => {
    const trimmedUsername = username.trim().toLowerCase();
    
    if (trimmedUsername === "admin" && password === "admin123") {
      const loggedUser = { username: "Admin", role: "admin" };
      setUser(loggedUser);
      try {
        window.localStorage.setItem("toyota_auth_user", JSON.stringify(loggedUser));
      } catch (err) {
        console.warn("Failed to persist auth state:", err);
      }
      return { success: true };
    } else if (trimmedUsername === "officer" && password === "officer123") {
      const loggedUser = { username: "Sales Officer", role: "officer" };
      setUser(loggedUser);
      try {
        window.localStorage.setItem("toyota_auth_user", JSON.stringify(loggedUser));
      } catch (err) {
        console.warn("Failed to persist auth state:", err);
      }
      return { success: true };
    }

    return { success: false, error: "Invalid username or password" };
  };

  const logout = () => {
    setUser(null);
    try {
      window.localStorage.removeItem("toyota_auth_user");
    } catch (err) {
      console.warn("Failed to clear auth state:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
