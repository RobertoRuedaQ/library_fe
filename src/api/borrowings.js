import API from "./api";

export const fetchBorrowings = () => API.get("/borrowings");
export const createBorrowing = (copyId) => API.post("/borrowings", { copy_id: copyId });
export const renewBorrowing = (id) => API.patch(`/borrowings/${id}/renew`);
export const returnBorrowing = (id) => API.patch(`/borrowings/${id}/return`);
