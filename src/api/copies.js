import API from "./api";

export const fetchCopies = (bookId) => {
    return API.get(`/books/${bookId}/copies`);
};
export const createCopy = (bookId, copyData) =>
    API.post(`/books/${bookId}/copies`, { copy: copyData });

export const getCopy = (id) =>
    API.get(`/copies/${id}`);

export const updateCopy = (id, copyData) =>
    API.put(`/copies/${id}`, { copy: copyData });

export const deleteCopy = (id) =>
    API.delete(`/copies/${id}`);
