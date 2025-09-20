import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import * as API from "../api/books";

export default function BookFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const userRole = user?.roles?.[0];

  const [book, setBook] = useState({
    title: "",
    item_type_id: null,
    type: "Book",
    author: "",
    genre: "",
    isbn: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!id;

  useEffect(() => {
    if (!isAuthenticated() || userRole !== "Librarian") {
      navigate("/books");
    }
  }, [isAuthenticated, userRole, navigate]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      API.fetchBook(id)
        .then(res => {
          setBook(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching book:", err);
          setError("Failed to load book details");
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!book.title.trim() || !book.author.trim()) {
      setError("Title and Author are required");
      setLoading(false);
      return;
    }

    try {
      const bookData = {
        title: book.title.trim(),
        item_type_id: book.item_type_id,
        type: book.type,
        author: book.author.trim(),
        genre: book.genre.trim() || null,
        isbn: book.isbn.trim() || null
      };

      if (isEditMode) {
        await API.updateBook(id, bookData);
      } else {
        await API.createBook(bookData);
      }

      navigate("/books");
    } catch (err) {
      console.error("Error saving book:", err);
      setError(err.response?.data?.error || "Failed to save book");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/books");
  };

  if (loading && isEditMode) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64 text-lg">
          Loading book details...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            {isEditMode ? "Edit Book" : "Add New Book"}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter book title"
                value={book.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                id="author"
                name="author"
                type="text"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter author name"
                value={book.author}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <input
                id="genre"
                name="genre"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter genre (optional)"
                value={book.genre}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                id="isbn"
                name="isbn"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter ISBN (optional)"
                value={book.isbn}
                onChange={handleChange}
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Saving..." : isEditMode ? "Update Book" : "Create Book"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
