import BookCard from "./BookCard";

export default function BookList({ books, onEdit, onDelete, onBorrow, userRole, isAuthenticated }) {
  return (
    < >
      {books.map(book => (
        <BookCard
          key={book.id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
          onBorrow={onBorrow}
          userRole={userRole}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </>
  );
}
