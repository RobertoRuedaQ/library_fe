import API from "./api";

export const register = (data) => API.post("/users", data);
