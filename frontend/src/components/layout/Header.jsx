import { FiBell } from "react-icons/fi"; // Import bell icon
import { FiUser } from "react-icons/fi"; // Import user profile icon

("use client");

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-800 backdrop-blur ">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-4 flex">
          <a
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            {/* MessageSquareCode icon would go here */}
            <span className="font-bold text-xl text-white">StackIt</span>
          </a>
        </div>

        {/* Search and Navigation */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Search Bar */}
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              {/* Search icon could be added here using an SVG or another icon library */}
              <input
                type="search"
                placeholder="Search questions..."
                className="w-full bg-gray-800 pl-8 md:w-[200px] lg:w-[320px] focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-md border border-gray-700 px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <nav className="flex items-center gap-2">
            {/* Ask Question Button */}
            <button className="hidden sm:inline-flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Ask Question
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-full hover:bg-gray-800">
              <FiBell className="h-5 w-5 text-blue-400" /> {/* Bell icon */}
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                3
              </span>
            </button>

            {/* User Profile Icon */}
            <button className="relative p-2 rounded-full hover:bg-gray-800">
              <FiUser className="h-5 w-5 text-blue-400" />{" "}
              {/* User profile icon */}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
