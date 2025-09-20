import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as BookAPI from "../api/books";
import Navbar from "../components/Navbar";
import CopyList from "../components/CopyList";
import { useAuth } from "../contexts/AuthContext";

export default function BookShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const userRole = user?.roles?.[0];

  useEffect(() => {
    const loadBook = async () => {
      try {
        const response = await BookAPI.fetchBook(id);
        setBook(response.data);
      } catch (err) {
        console.error("Error loading book:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [id]);

  const handleEdit = () => {
    navigate(`/books/${id}/edit`);
  };

  const handleCreate = () => {
    navigate("/books/new");
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading book...</div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div>
        <Navbar />
        <div className="p-6 text-center text-red-500">Book not found</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          {isAuthenticated() && userRole === "Librarian" && (
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Edit Book
              </button>
              <button
                onClick={handleCreate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                New Book
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-700 mb-6">by {book.author}</p>

        <CopyList
          bookId={book.id}
          userRole={userRole}
          isAuthenticated={isAuthenticated()}
        />
      </div>
    </div>
  );
}
