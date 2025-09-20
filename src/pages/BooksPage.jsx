import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import * as BookAPI from "../api/books";
import BookList from "../components/BookList";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function BooksPage() {
  const { user, isAuthenticated } = useAuth();
  const userRole = user?.roles?.[0];
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const loadBooks = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BookAPI.fetchBooks({ page, per_page: 9 });
      setBooks(response.data.books || response.data);
      setCurrentPage(response.data.meta?.current_page || page);
      setTotalPages(response.data.meta?.total_pages || 1);
    } catch (err) {
      console.error("Error loading books:", err);
      setError("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleEdit = (book) => {
    navigate(`/books/${book.id}/edit`);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await BookAPI.deleteBook(bookId);
      loadBooks(currentPage);
    } catch (err) {
      console.error("Error deleting book:", err);
      setError("Failed to delete book.");
    }
  };

  const handleCreate = () => {
    navigate("/books/new");
  };

  const handleBorrow = (bookId) => {
    console.log("Borrow book:", bookId);
  };

  const handlePageChange = (page) => {
    loadBooks(page);
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Books</h1>
          {isAuthenticated() && userRole === "Librarian" && (
            <button
              onClick={handleCreate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              New Book
            </button>
          )}
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20 text-gray-600">Loading books...</div>
        ) : (
          <>
            {/* Grid de libros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <BookList
                books={books}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onBorrow={handleBorrow}
                userRole={userRole}
                isAuthenticated={isAuthenticated()}
              />
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded ${i + 1 === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
