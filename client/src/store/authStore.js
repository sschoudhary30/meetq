import { create } from "zustand";

const useAuthStore = create((set) => ({
  // State
  user: (() => {
    try {
      const userInfo = localStorage.getItem("user-info");
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error("Error parsing user-info from localStorage:", error);
      return null;
    }
  })(),
  isAuthenticated: (() => {
    try {
      return !!localStorage.getItem("user-info");
    } catch (error) {
      console.error("Error checking isAuthenticated state:", error);
      return false;
    }
  })(),

  // Actions
  loginUser: (user) => {
    try {
      localStorage.setItem("user-info", JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error("Error saving user-info to localStorage:", error);
    }
  },
  logoutUser: () => {
    try {
      localStorage.removeItem("user-info");
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Error removing user-info from localStorage:", error);
    }
  },
  setUser: (user) => {
    try {
      localStorage.setItem("user-info", JSON.stringify(user));
      set({ user });
    } catch (error) {
      console.error("Error updating user-info in localStorage:", error);
    }
  },
}));

export default useAuthStore;
