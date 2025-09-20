import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { logout, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/books");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="flex space-x-6">
        <Link className="hover:text-gray-200 font-medium" to="/books">
          Books
        </Link>
        {isAuthenticated() && (
          <>
            <Link className="hover:text-gray-200 font-medium" to="/dashboard">
              Dashboard
            </Link>
            <Link className="hover:text-gray-200 font-medium" to="/borrowings">
              Borrowings
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {isAuthenticated() ? (
          <>
            <span className="text-sm text-gray-200">
              Welcome, {user?.name || "User"}
            </span>
            <button
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 font-medium transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600 font-medium transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
