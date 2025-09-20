import { useEffect, useState } from "react";
import * as API from "../api/dashboard";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const [borrowings, setBorrowings] = useState([]);
  const [totalOverdue, setTotalOverdue] = useState(0);
  const role = localStorage.getItem("role") || "Member";

  useEffect(() => {
    API.fetchDashboard()
      .then(res => {
        setBorrowings(res.data.borrowed_books || []);
        setTotalOverdue(res.data.total_overdue || 0);
      })
      .catch(console.error);
  }, []);

  if (!borrowings) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {role === "Librarian" ? (
        <p>Dashboard Librarian (pending implementation)</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-semibold mb-2">
              My borrowed books
            </h2>
            {borrowings.length === 0 ? (
              <p>You haven't borrowed any books yet.</p>
            ) : (
              <ul className="space-y-2">
                {borrowings.map(book => (
                  <li key={book.borrowing_id} className="flex justify-between">
                    <span>
                      {book.title} — due date: {book.due_date}
                    </span>
                    {book.overdue && !book.returned && (
                      <span className="text-red-600 ml-2">(overdue)</span>
                    )}
                    {book.returned && (
                      <span className="text-green-600 ml-2">(Returned)</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 font-semibold">
              Total overdue books: {totalOverdue}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
