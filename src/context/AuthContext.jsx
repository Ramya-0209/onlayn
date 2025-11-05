import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || storedUser === "undefined") return null;
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "user") {
        try {
          const newUser = e.newValue && e.newValue !== "undefined" ? JSON.parse(e.newValue) : null;
          setUser(newUser);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Do NOT clear other keys like cart or wishlist here — just handle UI accordingly
  };

  const isLoggedIn = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
