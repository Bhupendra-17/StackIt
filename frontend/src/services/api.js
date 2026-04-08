import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getCurrentUser: () => api.get("/auth/me"),
};

export const questionAPI = {
  getAllQuestions: (params = {}) => api.get("/questions/all", { params }),
  getQuestionById: (id) => api.get(`/questions/${id}`),
  createQuestion: (data) => api.post("/questions", data),
  upvoteQuestion: (id) => api.post(`/questions/${id}/upvote`),
};

export const answerAPI = {
  postAnswer: (data) => api.post("/answer", data),
  upvoteAnswer: (id) => api.post(`/answer/${id}/upvote`),
  commentOnAnswer: (id, content) => api.post(`/answer/${id}/comment`, { content }),
};

export const notificationAPI = {
  getNotifications: () => api.get("/notifications"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
};

export default api;

