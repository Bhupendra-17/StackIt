import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getCurrentUser: () => api.get("/auth/me"),
};

// Question APIs
export const questionAPI = {
  getAllQuestions: () => api.get("/questions/all"),
  createQuestion: (data) => api.post("/questions", data),
  upvoteQuestion: (id) => api.post(`/questions/${id}/upvote`),
};

// Answer APIs
export const answerAPI = {
  postAnswer: (data) => api.post("/answer", data),
  upvoteAnswer: (id) => api.post(`/answer/${id}/upvote`),
  commentOnAnswer: (id, content) =>
    api.post(`/answer/${id}/comment`, { content }),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: () => api.get("/notifications"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
};

export default api;
