import API from "./api";

export const login = (email, password) => API.post("/login", { email, password });
export const register = (userData) => API.post("/users", { user: userData });
export const logout = () => API.delete("/logout");
