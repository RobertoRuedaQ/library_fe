import { useEffect, useState } from "react";
import * as CopyAPI from "../api/copies";
import * as BorrowingAPI from "../api/borrowings";
import { useAuth } from "../contexts/AuthContext";

export default function CopyList({ bookId }) {
  const [copies, setCopies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userRole = user?.roles?.[0];
  const isMember = userRole === "Member";
  const isLibrarian = userRole === "Librarian";

  const [newCondition, setNewCondition] = useState("");
  const [newStatus, setNewStatus] = useState("available");

  const loadCopies = async () => {
    try {
      const response = await CopyAPI.fetchCopies(bookId);
      setCopies(response.data.copies || response.data);
    } catch (err) {
      console.error("Error loading copies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCopies();
  }, [bookId]);

  const handleBorrow = async (copyId) => {
    try {
      await BorrowingAPI.createBorrowing(copyId);
      alert("Book borrowed successfully!");
      loadCopies();
    } catch (err) {
      console.error("Error borrowing book:", err);
      alert("Failed to borrow book");
    }
  };

  const handleDelete = async (copyId) => {
    if (!window.confirm("Are you sure you want to delete this copy?")) return;
    try {
      await CopyAPI.deleteCopy(copyId);
      loadCopies();
    } catch (err) {
      console.error("Error deleting copy:", err);
    }
  };
  const handleAddCopy = async (e) => {
    e.preventDefault();
    try {
      await CopyAPI.createCopy(bookId, {
        condition: newCondition,
        status: newStatus,
      });

      setNewCondition("");
      setNewStatus("available");

      await loadCopies();
    } catch (err) {
      console.error("Error creating copy:", err);
    }
  };


  if (loading) return <div>Loading copies...</div>;

  return (
    <div className="space-y-4">
      {copies.length === 0 && <div>No copies available</div>}

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
            <p className="text-sm text-gray-500">Condition: {copy.condition}</p>
          </div>

          <div className="flex space-x-2">
            {copy.status === "available" && isMember && (
              <button
                onClick={() => handleBorrow(copy.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Borrow
              </button>
            )}

            {isLibrarian && (
              <button
                onClick={() => handleDelete(copy.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}

      {isLibrarian && (
        <form
          onSubmit={handleAddCopy}
          className="bg-gray-100 p-4 rounded mt-6 space-y-3"
        >
          <h4 className="font-semibold">Add a new copy</h4>
          <input
            type="text"
            placeholder="Condition"
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Add Copy
          </button>
        </form>
      )}
    </div>
  );
}
