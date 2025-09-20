import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as BookAPI from "../api/books";
import Navbar from "../components/Navbar";
import CopyList from "../components/CopyList";

export default function BookShowPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
        <p className="text-gray-700 mb-6">by {book.author}</p>
        <CopyList bookId={book.id} />
      </div>
    </div>
  );
}
