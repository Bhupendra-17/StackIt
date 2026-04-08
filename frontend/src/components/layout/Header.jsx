import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  CircleUserRound,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  X,
} from "lucide-react";
import { io } from "socket.io-client";
import { notificationAPI, SOCKET_URL } from "../../services/api";
import { useAuth } from "../context/auth-context";

const formatTime = (value) => {
  if (!value) {
    return "just now";
  }

  const date = new Date(value);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchText(params.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    const loadNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const response = await notificationAPI.getNotifications();
        setNotifications(response.data.notifications || []);
      } catch {
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    };

    loadNotifications();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return undefined;
    }

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: false,
    });

    socket.on("connect", () => {
      socket.emit("register", user.id);
    });

    socket.on("notification", (payload) => {
      setNotifications((current) => [
        {
          _id: payload.id || `local-${Date.now()}`,
          message: payload.message,
          type: payload.type,
          link: payload.link,
          createdAt: payload.createdAt,
          read: false,
        },
        ...current,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user?.id]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchText.trim();
    const params = new URLSearchParams(location.search);
    params.delete("question");

    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }

    navigate({
      pathname: "/",
      search: params.toString(),
    });

    setShowMobileMenu(false);
  };

  const handleAskQuestion = () => {
    navigate(isAuthenticated ? "/ask" : "/login");
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((items) =>
        items.map((item) =>
          item._id === notificationId ? { ...item, read: true } : item,
        ),
      );
    } catch {
      // no-op: keep UI responsive even when request fails
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    } catch {
      // no-op: keep UI responsive even when request fails
    }
  };

  return (
    <header className="relative z-20 border-b border-slate-700/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-slate-900/60 px-3 py-2 transition hover:border-cyan-300/40"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 font-heading text-lg font-semibold text-slate-950">
            S
          </span>
          <span className="hidden text-lg font-heading font-semibold tracking-wide text-slate-100 sm:inline">
            StackIt
          </span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="hidden flex-1 md:block">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search questions, tags, or topics"
              className="app-input h-11 w-full rounded-xl pl-10 pr-3"
            />
          </label>
        </form>

        <button
          type="button"
          onClick={handleAskQuestion}
          className="app-btn-primary hidden items-center gap-2 rounded-xl px-4 py-2.5 font-medium md:inline-flex"
        >
          <PlusCircle className="h-4 w-4" />
          Ask
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotificationMenu((open) => !open)}
                className="relative rounded-xl border border-slate-700 bg-slate-900/70 p-2.5 text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-cyan-400 px-1 text-xs font-semibold text-slate-950">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotificationMenu && (
                <div className="absolute right-0 mt-2 w-[20rem] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-700/60 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-100">Notifications</p>
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-cyan-300 transition hover:text-cyan-200"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-80 overflow-auto">
                    {loadingNotifications ? (
                      <p className="px-4 py-6 text-sm text-slate-400">Loading...</p>
                    ) : notifications.length === 0 ? (
                      <p className="px-4 py-6 text-sm text-slate-400">No notifications yet.</p>
                    ) : (
                      notifications.slice(0, 20).map((notification) => (
                        <button
                          key={notification._id}
                          type="button"
                          onClick={() => {
                            if (!notification.read) {
                              handleMarkAsRead(notification._id);
                            }
                            setShowNotificationMenu(false);
                            if (notification.link) {
                              navigate(notification.link);
                            }
                          }}
                          className={`block w-full border-b border-slate-800/70 px-4 py-3 text-left transition hover:bg-slate-800/70 ${
                            notification.read ? "opacity-70" : ""
                          }`}
                        >
                          <p className="text-sm text-slate-100">{notification.message}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {formatTime(notification.createdAt)}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/profile"
              className="hidden rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200 sm:flex sm:items-center sm:gap-2"
            >
              <CircleUserRound className="h-4 w-4" />
              {user?.username}
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-700 bg-slate-900/70 p-2.5 text-slate-200 transition hover:border-rose-300/40 hover:text-rose-200"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login" className="app-btn-ghost rounded-xl px-4 py-2.5 text-sm font-medium">
              Log in
            </Link>
            <Link to="/signup" className="app-btn-primary rounded-xl px-4 py-2.5 text-sm font-medium">
              Create account
            </Link>
          </div>
        )}

        <button
          type="button"
          className="ml-auto rounded-xl border border-slate-700 bg-slate-900/70 p-2 text-slate-200 md:hidden"
          onClick={() => setShowMobileMenu((open) => !open)}
        >
          {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {showMobileMenu && (
        <div className="border-t border-slate-700/60 bg-slate-950/95 px-4 pb-4 pt-3 md:hidden">
          <form onSubmit={handleSearchSubmit}>
            <label className="relative mb-3 block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search questions"
                className="app-input h-11 w-full rounded-xl pl-10 pr-3"
              />
            </label>
          </form>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleAskQuestion}
              className="app-btn-primary w-full rounded-xl px-4 py-2.5 text-sm font-medium"
            >
              Ask Question
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="app-btn-ghost rounded-xl px-4 py-2.5 text-sm"
                >
                  View profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-rose-300/30 bg-rose-400/10 px-4 py-2.5 text-sm text-rose-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="app-btn-ghost rounded-xl px-4 py-2.5 text-sm"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setShowMobileMenu(false)}
                  className="app-btn-primary rounded-xl px-4 py-2.5 text-sm"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


