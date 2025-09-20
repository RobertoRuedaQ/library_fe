import API, { PublicAPI } from "./api";

export const fetchBookCopies = (bookId) => PublicAPI.get(`/books/${bookId}/copies`);
export const fetchCopy = (copyId) => PublicAPI.get(`/copies/${copyId}`);
export const updateCopy = (copyId, copyData) => API.patch(`/copies/${copyId}`, { copy: copyData });
export const deleteCopy = (copyId) => API.delete(`/copies/${copyId}`);
