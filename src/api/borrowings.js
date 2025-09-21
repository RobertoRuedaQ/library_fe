import API from "./api";

export const fetchBorrowings = () => API.get("/borrowings");

export const createBorrowing = (copyId) =>
    API.post("/borrowings", { copy_id: copyId });

export const renewBorrowing = (id) =>
    API.patch(`/borrowings/${id}/renew`);

export const returnBorrowing = (id) =>
    API.patch(`/borrowings/${id}/return`);

export const filterActiveBorrowings = (borrowings) =>
    borrowings.filter((b) => !b.returned_at);

export const filterOverdueBorrowings = (borrowings) =>
    borrowings.filter(
        (b) => !b.returned_at && new Date(b.due_at) < new Date()
    );

export const filterReturnedBorrowings = (borrowings) =>
    borrowings.filter((b) => b.returned_at);
