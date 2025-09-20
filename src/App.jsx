import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BooksPage from "./pages/BooksPage";
import BookShowPage from "./pages/BookShowPage";
import BookFormPage from "./pages/BookFormPage";
import BorrowingsPage from "./pages/BorrowingsPage";
import { AuthProvider } from "./contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const LibrarianRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role !== "Librarian") {
    return <Navigate to="/books" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:id" element={<BookShowPage />} />
          <Route path="/books/new" element={<LibrarianRoute><BookFormPage /></LibrarianRoute>} />
          <Route path="/books/:id/edit" element={<LibrarianRoute><BookFormPage /></LibrarianRoute>} />
          <Route path="/borrowings" element={<ProtectedRoute><BorrowingsPage /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/books" />} />
          <Route path="*" element={<Navigate to="/books" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
