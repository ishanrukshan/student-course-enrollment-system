# 🎓 EduEnroll — Student Course Enrollment System

A full-stack web application for managing student enrollments, built with the **MERN stack** (MongoDB, Express, React, Node.js). Features a modern dark-themed dashboard with analytics, bulk operations, and Docker support.

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### Dashboard
- 📊 **Stat cards** — total students, active, pending, and course count
- 🔍 **Search & filter** — search by name/email, filter by course
- 📋 **Sortable tables** — click headers to sort by any column
- ✅ **Bulk operations** — select multiple students to delete or change status
- 📄 **Pagination** — server-side pagination with 10 records per page
- 📥 **CSV export** — export current view to CSV

### Student Management
- ➕ Add, edit, and delete students via modal forms
- 📧 Unique email validation
- 🏷️ Status tracking (Active, Pending, Completed)
- 👤 Individual student detail pages

### Course Management
- 📚 Full CRUD for courses
- 🔗 Courses linked to student enrollments

### Analytics
- 📈 **Bar chart** — students per course
- 🟢 **Pie chart** — enrollment status breakdown
- 📊 Powered by [Recharts](https://recharts.org)

### UI/UX
- 🌙 Dark theme with modern glassmorphism design
- 🔔 Custom toast notifications (success, error, warning, info)
- ⚠️ Custom confirmation dialogs (replaces browser alerts)
- 📱 Responsive design with mobile hamburger menu
- 🔐 JWT authentication with login/register

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS, Recharts |
| **Backend** | Node.js, Express 5, Mongoose |
| **Database** | MongoDB (Atlas or local) |
| **Auth** | JWT (jsonwebtoken + bcryptjs) |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 📁 Project Structure

```
student-course-enrollment-system/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers (auth, student, course, analytics)
│   ├── middleware/       # JWT auth middleware
│   ├── models/          # Mongoose schemas (User, Student, Course)
│   ├── routes/          # Express routes
│   ├── seed.js          # Database seeder (courses + 25 students)
│   ├── seedMore.js      # Add 25 more students
│   ├── server.js        # Entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios API client
│   │   ├── components/  # Reusable components (Sidebar, SearchBar, Toast, etc.)
│   │   ├── pages/       # Page components (Dashboard, Courses, Analytics, etc.)
│   │   ├── App.jsx      # Routing
│   │   └── index.css    # Global styles
│   ├── nginx.conf       # Nginx config for Docker
│   └── Dockerfile
├── docker-compose.yml
├── .env                 # Environment variables (not committed)
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- [Docker](https://www.docker.com/) (optional)

### Environment Variables

Create a `.env` file in the **project root** and in `backend/`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/studentEnrollmentDB?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
```

---

### Option 1: Run with Docker (Recommended)

```bash
# Clone the repo
git clone https://github.com/ishanrukshan/student-course-enrollment-system.git
cd student-course-enrollment-system

# Create .env file with your MongoDB URI and JWT secret (see above)

# Build and run
docker-compose up --build
```

Open **http://localhost** in your browser.

---

### Option 2: Run Locally

**Backend:**
```bash
cd backend
npm install
npm run dev        # Starts on port 5000
```

**Frontend** (in a new terminal):
```bash
cd frontend
npm install
npm run dev        # Starts on port 5173
```

Open **http://localhost:5173** in your browser.

---

### Seed the Database

```bash
# From the backend directory (local)
node seed.js          # Adds 8 courses + 25 students
node seedMore.js      # Adds 25 more students

# From Docker
docker exec enrollment-backend node seed.js
docker exec enrollment-backend node seedMore.js
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Students (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students (with search, filter, pagination, sort) |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |
| POST | `/api/students/bulk-delete` | Bulk delete students |
| PATCH | `/api/students/bulk-status` | Bulk update status |

### Courses (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| POST | `/api/courses` | Create a course |
| PUT | `/api/courses/:id` | Update a course |
| DELETE | `/api/courses/:id` | Delete a course |

### Analytics (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get enrollment statistics |

---

## 🐳 Docker Architecture

```
┌─────────────────┐      ┌──────────────────┐     ┌──────────────┐
│    Frontend     │      │     Backend      │     │   MongoDB    │
│  (Nginx :80)    │───▶ │  (Node.js :5000)│────▶ │   (Atlas)    │
│                 │      │                  │     │              │
│  React SPA      │      │  Express API     │     │  Cloud DB    │
│  /api → proxy   │      │  JWT Auth        │     │              │
└─────────────────┘      └──────────────────┘     └──────────────┘
```

---

## 📸 Screenshots
<img width="1920" height="920" alt="image" src="https://github.com/user-attachments/assets/88d0f5b6-93af-4661-a4e2-dc03045422f9" />
<img width="1920" height="918" alt="image" src="https://github.com/user-attachments/assets/a6fccf67-7d53-4e94-a187-45b87373ede6" />
<img width="1912" height="912" alt="image" src="https://github.com/user-attachments/assets/ffaf5597-0050-4cbe-9e9b-66201e63f869" />
<img width="1911" height="908" alt="image" src="https://github.com/user-attachments/assets/0ced42af-e404-41b3-9128-6ed4463ad7a9" />
<img width="1914" height="908" alt="image" src="https://github.com/user-attachments/assets/584bb000-03cc-4807-b3fa-577f07a4daf3" />
<img width="1910" height="912" alt="image" src="https://github.com/user-attachments/assets/f2f1c971-45d2-480a-a341-135a6a910d70" />
<img width="1919" height="915" alt="image" src="https://github.com/user-attachments/assets/b85d487e-3c65-4112-b763-1669fe881723" />




## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Ishan Rukshan**
- GitHub: [@ishanrukshan](https://github.com/ishanrukshan)
