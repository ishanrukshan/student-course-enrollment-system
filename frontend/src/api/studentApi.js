import axios from "axios";

// Single Axios instance for all API calls
const API = axios.create({ baseURL: "/api" });

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global 401 handler — auto-redirect to login on expired/invalid token
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // Only redirect if not already on the login page
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

// ─── Auth ────────────────────────────────────────────────
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// ─── Students ────────────────────────────────────────────
export const getAllStudents = (search = "", course = "", page = 1, limit = 10, sortField = "createdAt", sortOrder = "desc") => {
    const params = { page, limit, sortField, sortOrder };
    if (search) params.search = search;
    if (course) params.course = course;
    return API.get("/students", { params });
};

export const getStudentById = (id) => API.get(`/students/${id}`);
export const getStudentsByEmail = (email) => API.get(`/students/email/${email}`);
export const createStudent = (data) => API.post("/students", data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
export const bulkDeleteStudents = (ids) => API.post("/students/bulk-delete", { ids });
export const bulkUpdateStatus = (ids, status) => API.put("/students/bulk-status", { ids, status });

// ─── Courses ─────────────────────────────────────────────
export const getAllCourses = () => API.get("/courses");
export const createCourse = (data) => API.post("/courses", data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// ─── Analytics ───────────────────────────────────────────
export const getAnalytics = () => API.get("/analytics");
