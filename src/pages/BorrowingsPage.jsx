import { useEffect, useState, useMemo } from "react";
import * as BorrowingAPI from "../api/borrowings";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

function parseDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (!isNaN(dt)) return dt;
  const normalized = String(d).trim().replace(/\s+/g, "-");
  const dt2 = new Date(normalized);
  return isNaN(dt2) ? null : dt2;
}

export default function BorrowingsPage() {
  const { user } = useAuth();
  const role = user?.roles?.[0];
  const [allBorrowings, setAllBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scope, setScope] = useState("all");
  const [renewingId, setRenewingId] = useState(null);
  const [returningId, setReturningId] = useState(null);

  const loadBorrowings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BorrowingAPI.fetchBorrowings();
      setAllBorrowings(res.data.borrowings || res.data || []);
    } catch (err) {
      console.error("Error loading borrowings:", err);
      setError("Failed to load borrowings");
      setAllBorrowings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBorrowings();
  }, []);

  const handleRenew = async (id) => {
    setRenewingId(id);
    try {
      await BorrowingAPI.renewBorrowing(id);
      await loadBorrowings();
    } catch (err) {
      console.error("Error renewing borrowing:", err);
      alert(err.response?.data?.error || "Failed to renew borrowing");
    } finally {
      setRenewingId(null);
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm("Are you sure you want to return this book?")) return;
    setReturningId(id);
    try {
      await BorrowingAPI.returnBorrowing(id);
      await loadBorrowings();
    } catch (err) {
      console.error("Error returning borrowing:", err);
      alert(err.response?.data?.error || "Failed to return book");
    } finally {
      setReturningId(null);
    }
  };

  const filtered = useMemo(() => {
    const now = new Date();
    return allBorrowings.filter((b) => {
      const returned = !!b.returned_at;
      const due = parseDate(b.due_at || b.due_date);
      if (scope === "active") {
        return !returned;
      }
      if (scope === "overdue") {
        return !returned && due && due < now;
      }
      if (scope === "returned") {
        return returned;
      }
      return true; // all
    }).sort((a, b) => {
      const da = parseDate(a.due_at || a.due_date);
      const db = parseDate(b.due_at || b.due_date);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da - db;
    });
  }, [allBorrowings, scope]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading borrowings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          <button onClick={loadBorrowings} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Borrowings</h1>
          {role === "Librarian" && (
            <div className="text-sm text-gray-600">Showing: {filtered.length} of {allBorrowings.length}</div>
          )}
        </div>

        {role === "Librarian" && (
          <div className="flex gap-3 mb-6">
            {["all", "active", "overdue", "returned"].map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`px-4 py-2 rounded ${scope === s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No borrowings found.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => {
              const dueDate = parseDate(b.due_at || b.due_date);
              const borrowedOn = parseDate(b.borrowed_at || b.created_at);
              const isReturned = !!b.returned_at;
              const isOverdue = !isReturned && dueDate && dueDate < new Date();
              const borrowerName = typeof b.user === "string" ? b.user : (b.user?.name || "Unknown");

              return (
                <div key={b.id} className={`bg-white border rounded-lg p-6 shadow-sm ${isOverdue ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {b.copy?.borrowable?.title || (b.copy?.borrowable_id ? `Book #${b.copy.borrowable_id}` : "Unknown Book")}
                        </h3>
                        {isOverdue && <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Overdue</span>}
                        {isReturned && <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">Returned</span>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div><span className="font-medium">Borrower:</span> {borrowerName}</div>
                        <div><span className="font-medium">Copy ID:</span> #{b.copy?.id || "Unknown"}</div>
                        <div><span className="font-medium">Borrowed on:</span> {borrowedOn ? borrowedOn.toLocaleDateString() : "N/A"}</div>
                        <div className={isOverdue ? "text-red-600 font-medium" : ""}><span className="font-medium">Due date:</span> {dueDate ? dueDate.toLocaleDateString() : "N/A"}</div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleRenew(b.id)}
                        disabled={renewingId === b.id}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {renewingId === b.id ? "Renewing..." : "Renew"}
                      </button>

                      {role === "Librarian" && !isReturned && (
                        <button
                          onClick={() => handleReturn(b.id)}
                          disabled={returningId === b.id}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {returningId === b.id ? "Returning..." : "Return"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <button onClick={loadBorrowings} className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition-colors">Refresh</button>
        </div>
      </div>
    </div>
  );
}
