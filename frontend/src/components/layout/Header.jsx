import { FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleAskQuestion = () => {
    if (isAuthenticated) {
      navigate("/ask");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-800 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <div className="mr-4 flex">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <span className="font-bold text-xl text-white">StackIt</span>
          </Link>
        </div>

        {/* Search and Navigation */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Search Bar */}
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <input
                type="search"
                placeholder="Search questions..."
                className="w-full bg-gray-700 pl-8 md:w-[200px] lg:w-[320px] focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-md border border-gray-600 px-3 py-2 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <nav className="flex items-center gap-2">
            {/* Ask Question Button */}
            <button
              onClick={handleAskQuestion}
              className="hidden sm:inline-flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Ask Question
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-gray-700">
                  <FiBell className="h-5 w-5 text-blue-400" />
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    0
                  </span>
                </button>

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="relative p-2 rounded-full hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FiUser className="h-5 w-5 text-blue-400" />
                    <span className="hidden md:inline text-white text-sm">
                      {user?.username}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm text-white font-medium">
                          {user?.username}
                        </p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                      >
                        <FiLogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
