import { useEffect, useState } from "react";
import * as CopyAPI from "../api/copies";
import * as BorrowingAPI from "../api/borrowings";

export default function CopyList({ bookId }) {
  const [copies, setCopies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCopies = async () => {
      try {
        const response = await CopyAPI.fetchBookCopies(bookId);
        setCopies(response.data.copies || response.data);
      } catch (err) {
        console.error("Error loading copies:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCopies();
  }, [bookId]);

  const handleBorrow = async (copyId) => {
    try {
      await BorrowingAPI.createBorrowing(copyId);
      alert("Book borrowed successfully!");
    } catch (err) {
      console.error("Error borrowing book:", err);
      alert("Failed to borrow book");
    }
  };

  if (loading) {
    return <div>Loading copies...</div>;
  }

  if (copies.length === 0) {
    return <div>No copies available</div>;
  }

  return (
    <div className="space-y-4">
      {copies.map((copy) => (
        <div
          key={copy.id}
          className="flex justify-between items-center bg-white border rounded-lg p-4 shadow-sm"
        >
          <div>
            <span className="font-medium">Copy #{copy.id}</span>{" "}
            <span className="text-gray-600">
              ({copy.status || "available"})
            </span>
          </div>

          {copy.status === "available" && (
            <button
              onClick={() => handleBorrow(copy.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Borrow
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
