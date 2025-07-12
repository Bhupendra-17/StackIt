"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiBell, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// 🔧 Simulated notification count (replace this with real backend later)
const unreadNotificationCount = 0; // change to 0 to simulate no unread

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  // 🧠 Example: you can decode the username from token (replace with real logic)
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setShowProfileMenu(false);
    navigate("/login");
  };

  const handleClickOutside = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setShowProfileMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-800 backdrop-blur">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-4 flex">
          <a
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <span className="font-bold text-xl text-white">StackIt</span>
          </a>
        </div>

        {/* Search and Navigation */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Search Bar */}
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <input
                type="search"
                placeholder="Search questions..."
                className="w-full bg-gray-800 pl-8 md:w-[200px] lg:w-[320px] focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-md border border-gray-700 px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <nav className="flex items-center gap-3">
            {/* Ask Question Button */}
            <button className="hidden sm:inline-flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Ask Question
            </button>

            {/* 🔔 Notifications */}
            <div className="relative p-2 rounded-full hover:bg-gray-800 cursor-pointer">
              <FiBell className="h-5 w-5 text-blue-400" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {unreadNotificationCount}
                </span>
              )}
            </div>

            {/* 👤 User Section */}
            {!token ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Log In
              </button>
            ) : (
              <div className="relative flex items-center gap-2" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="flex items-center space-x-1 cursor-pointer hover:opacity-80"
                >
                  <FiUser className="h-5 w-5 text-blue-400" />
                  <span className="text-white text-sm font-medium">
                    {username}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-28 w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg rounded-md z-50">
                    <div className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                      <p className="text-sm font-semibold">👋 {username}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
