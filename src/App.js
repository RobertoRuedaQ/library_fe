import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BooksPage from './pages/BooksPage';
import BookShowPage from './pages/BookShowPage';
import BookFormPage from './pages/BookFormPage';
import BorrowingsPage from './pages/BorrowingsPage';
import DashboardPage from './pages/DashboardPage'; // Asumiendo que tienes esta página

// Componente para rutas protegidas
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isAuthenticated() ? children : <Navigate to="/login" />;
}

// Componente para rutas públicas (solo accesibles sin autenticar)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
}

// Componente para rutas solo de bibliotecarios
function LibrarianRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const role = localStorage.getItem("role");

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (role !== "Librarian") {
    return <Navigate to="/books" />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />


      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/books"
        element={<BooksPage />}
      />

      <Route
        path="/books/:id"
        element={<BookShowPage />}
      />

      <Route
        path="/books/new"
        element={
          <LibrarianRoute>
            <BookFormPage />
          </LibrarianRoute>
        }
      />

      <Route
        path="/books/:id/edit"
        element={
          <LibrarianRoute>
            <BookFormPage />
          </LibrarianRoute>
        }
      />

      <Route
        path="/borrowings"
        element={
          <ProtectedRoute>
            <BorrowingsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/books" />} />

      <Route path="*" element={<Navigate to="/books" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;