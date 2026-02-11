import axios from "axios";

const API = axios.create({ baseURL: "/api/students" });
const CourseAPI = axios.create({ baseURL: "/api/courses" });
const AuthAPI = axios.create({ baseURL: "/api/auth" });

// Attach JWT token to requests
const authHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

API.interceptors.request.use((config) => {
    config.headers = { ...config.headers, ...authHeader() };
    return config;
});

CourseAPI.interceptors.request.use((config) => {
    config.headers = { ...config.headers, ...authHeader() };
    return config;
});

// Auth
export const loginUser = (data) => AuthAPI.post("/login", data);
export const registerUser = (data) => AuthAPI.post("/register", data);

// Students
export const getAllStudents = (search = "", course = "", page = 1, limit = 10, sortField = "createdAt", sortOrder = "desc") => {
    const params = { page, limit, sortField, sortOrder };
    if (search) params.search = search;
    if (course) params.course = course;
    return API.get("/", { params });
};

export const getStudentById = (id) => API.get(`/${id}`);
export const getStudentsByEmail = (email) => API.get(`/email/${email}`);
export const createStudent = (data) => API.post("/", data);
export const updateStudent = (id, data) => API.put(`/${id}`, data);
export const deleteStudent = (id) => API.delete(`/${id}`);
export const bulkDeleteStudents = (ids) => API.post("/bulk-delete", { ids });
export const bulkUpdateStatus = (ids, status) => API.put("/bulk-status", { ids, status });

// Courses
export const getAllCourses = () => CourseAPI.get("/");
export const createCourse = (data) => CourseAPI.post("/", data);
export const updateCourse = (id, data) => CourseAPI.put(`/${id}`, data);
export const deleteCourse = (id) => CourseAPI.delete(`/${id}`);
