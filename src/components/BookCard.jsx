import { Link } from "react-router-dom";

export default function BookCard({ book, onEdit, onDelete, onBorrow, userRole, isAuthenticated }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <Link
          to={`/books/${book.id}`}
          className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors"
        >
          {book.title}
        </Link>
        <p className="text-gray-600 mb-1">
          <span className="font-medium">Author:</span> {book.author}
        </p>
        {book.genre && (
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Genre:</span> {book.genre}
          </p>
        )}
        {book.isbn && (
          <p className="text-gray-600 mb-1">
            <span className="font-medium">ISBN:</span> {book.isbn}
          </p>
        )}
        <p className="text-gray-600">
          <span className="font-medium">Copies:</span> {book.copies_count} copies
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {isAuthenticated && userRole === "Librarian" && (
          <>
            <button
              onClick={() => onEdit(book)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(book.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Delete
            </button>
          </>
        )}

        {book.copies_count > 0 ? (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
            {book.copies_count} copies available
          </span>
        ) : (
          <span className="bg-gray-300 text-gray-600 px-3 py-1 rounded text-sm">
            No copies available
          </span>
        )}
      </div>
    </div>
  );
}