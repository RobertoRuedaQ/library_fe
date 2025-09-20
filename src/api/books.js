import API, { PublicAPI } from "./api";

export const fetchBooks = (filters = {}, page = 1) => {
    const params = new URLSearchParams();

    params.append('page', page);

    if (filters.title) params.append('title', filters.title);
    if (filters.author) params.append('author', filters.author);
    if (filters.genre) params.append('genre', filters.genre);

    return PublicAPI.get(`/books?${params.toString()}`);
};
export const fetchBook = (id) => PublicAPI.get(`/books/${id}`);
export const createBook = (book) => API.post(`/books`, { book });
export const updateBook = (id, book) => API.patch(`/books/${id}`, { book });
export const deleteBook = (id) => API.delete(`/books/${id}`);
