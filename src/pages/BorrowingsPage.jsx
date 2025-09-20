import { useEffect, useState } from "react";
import * as BorrowingAPI from "../api/borrowings";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function BorrowingsPage() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renewingBorrowing, setRenewingBorrowing] = useState(null);
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("token");
  const userRole = isAuthenticated ? (localStorage.getItem("role") || "Member") : null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadBorrowings();
  }, [isAuthenticated, navigate]);

  const loadBorrowings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BorrowingAPI.fetchBorrowings();
      setBorrowings(response.data.borrowings || response.data);
    } catch (err) {
      console.error("Error loading borrowings:", err);
      setError("Failed to load borrowings");
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (borrowingId) => {
    setRenewingBorrowing(borrowingId);
    try {
      await BorrowingAPI.renewBorrowing(borrowingId);
      await loadBorrowings();
    } catch (err) {
      console.error("Error renewing borrowing:", err);
      alert("Failed to renew borrowing");
    } finally {
      setRenewingBorrowing(null);
    }
  };

  const handleReturn = async (borrowingId) => {
    if (window.confirm("Are you sure you want to return this book?")) {
      try {
        await BorrowingAPI.returnBorrowing(borrowingId);
        await loadBorrowings();
      } catch (err) {
        console.error("Error returning borrowing:", err);
        alert("Failed to return book");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading your borrowings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <button
            onClick={loadBorrowings}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Borrowings</h1>

        {borrowings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">You haven't borrowed any books yet.</div>
            <button
              onClick={() => navigate("/books")}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {borrowings.map((borrowing) => (
              <div
                key={borrowing.id}
                className={`bg-white border rounded-lg p-6 shadow-sm ${isOverdue(borrowing.due_date) ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {borrowing.book?.title || borrowing.copy?.book?.title || 'Unknown Book'}
                      </h3>
                      {isOverdue(borrowing.due_date) && (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          Overdue
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Author:</span> {borrowing.book?.author || borrowing.copy?.book?.author || 'Unknown'}
                      </div>
                      <div>
                        <span className="font-medium">Copy ID:</span> #{borrowing.copy?.id || 'Unknown'}
                      </div>
                      <div>
                        <span className="font-medium">Borrowed on:</span> {formatDate(borrowing.created_at)}
                      </div>
                      <div className={isOverdue(borrowing.due_date) ? 'text-red-600 font-medium' : ''}>
                        <span className="font-medium">Due date:</span> {formatDate(borrowing.due_date)}
                      </div>
                    </div>

                    {borrowing.renewed_at && (
                      <div className="mt-2 text-sm text-blue-600">
                        <span className="font-medium">Last renewed:</span> {formatDate(borrowing.renewed_at)}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleRenew(borrowing.id)}
                      disabled={renewingBorrowing === borrowing.id}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {renewingBorrowing === borrowing.id ? 'Renewing...' : 'Renew'}
                    </button>

                    <button
                      onClick={() => handleReturn(borrowing.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Return
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/books")}
            className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition-colors"
          >
            Back to Books
          </button>
        </div>
      </div>
    </div>
  );
}