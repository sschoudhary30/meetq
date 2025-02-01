import {create} from "zustand";

const usefanLoginStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user-info")),
  isAuthenticated: false,
  loginUser: () => set({ isAuthenticated: true }),
  logoutUser: () => set({ isAuthenticated: false }),
  setUser: (user) => set({ user }),
}));

export default usefanLoginStore;