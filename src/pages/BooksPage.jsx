import { useEffect, useState } from "react";
import * as BookAPI from "../api/books";
import * as BorrowingAPI from "../api/borrowings";
import BookList from "../components/BookList";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    author: "",
    genre: ""
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_entries: 0
  });
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("token");
  const userRole = isAuthenticated ? (localStorage.getItem("role") || "Member") : null;

  const loadBooks = async (page = 1) => {
    setLoading(true);
    try {
      const res = await BookAPI.fetchBooks(filters, page);
      setBooks(res.data.books || res.data);

      // Handle pagination metadata
      if (res.data.meta) {
        setPagination({
          current_page: res.data.meta.current_page,
          total_pages: res.data.meta.total_pages,
          total_entries: res.data.meta.total_entries
        });
      }
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks(currentPage);
  }, [filters, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      title: "",
      author: "",
      genre: ""
    });
  };

  const handleEdit = (book) => navigate(`/books/${book.id}/edit`);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await BookAPI.deleteBook(id);
        loadBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const handleBorrow = async (id) => {
    // Redirect to book show page for copy-based borrowing
    navigate(`/books/${id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Books</h1>

        {/* Search Filters */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Search Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="title-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title-filter"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by title"
                value={filters.title}
                onChange={e => handleFilterChange('title', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="author-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                id="author-filter"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by author"
                value={filters.author}
                onChange={e => handleFilterChange('author', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="genre-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <input
                id="genre-filter"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by genre"
                value={filters.genre}
                onChange={e => handleFilterChange('genre', e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
            {isAuthenticated && userRole === "Librarian" && (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                onClick={() => navigate("/books/new")}
              >
                Add Book
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BookList
                books={books}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onBorrow={handleBorrow}
                userRole={userRole}
                isAuthenticated={isAuthenticated}
              />
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
                totalEntries={pagination.total_entries}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
