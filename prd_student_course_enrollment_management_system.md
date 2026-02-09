# Product Requirements Document (PRD)

## 1. Product Overview

### Product Name
Student Course Enrollment Management System

### Purpose
The Student Course Enrollment Management System is a full‑stack web application designed to help administrators manage student enrollments efficiently. The system enables admins to view, add, update, delete, search, and filter student records through a clean and responsive interface backed by a RESTful API.

### Target Users
- System Administrator (primary user)

### Problem Statement
Manual or poorly structured student enrollment management leads to inefficiency, data inconsistency, and poor visibility. This system centralizes student enrollment data and provides intuitive tools for management.

### Goals
- Provide a complete CRUD‑based student enrollment system
- Demonstrate full‑stack development skills
- Ensure clean UI, proper validation, and reliable backend logic

---

## 2. Scope

### In Scope
- Admin dashboard for managing students
- RESTful backend API
- MongoDB database integration
- Validation and error handling
- Responsive frontend UI

### Out of Scope
- Student self‑registration (unless added as bonus)
- Payment processing
- Advanced role‑based access control

---

## 3. Functional Requirements

### 3.1 Frontend Requirements

#### 3.1.1 Dashboard
- Display a list of all students
- Columns:
  - Name
  - Email
  - Course
  - Status
- Status badge:
  - Pending → highlighted (badge or row color)

#### 3.1.2 Search & Filter
- Search students by name (real‑time or on submit)
- Filter students by course

#### 3.1.3 Add Student
- Form fields:
  - Name (required)
  - Email (required, valid format)
  - Phone (required, digits only)
  - Course (required)
  - Status (Pending / Active / Completed)
- Client‑side validation
- Show success/error messages

#### 3.1.4 Edit Student
- Edit existing student details
- Pre‑filled form
- Validation applied

#### 3.1.5 Delete Student
- Confirmation before delete
- Immediate UI update after deletion

---

### 3.2 Backend Requirements

#### API Endpoints

| Method | Endpoint | Description |
|------|--------|------------|
| GET | /students | Fetch all students |
| POST | /students | Create new student |
| PUT | /students/:id | Update student |
| DELETE | /students/:id | Delete student |

#### API Rules
- Return JSON responses
- Proper HTTP status codes
- Error handling for invalid requests

---

### 3.3 Database Requirements

#### Database
- MongoDB

#### Schema (Mongoose)
```
Student
- name: String (required)
- email: String (required, unique)
- phone: String (required)
- course: String (required)
- status: String (enum: Pending, Active, Completed)
- createdAt: Date
```

---

## 4. Business Rules

- Students with status "Pending" must be visually highlighted
- Email must be unique
- Phone number must contain digits only
- All required fields must be validated

---

## 5. Non‑Functional Requirements

### Performance
- Load student list within 2 seconds

### Security
- Input validation on frontend and backend
- Optional authentication (bonus)

### Usability
- Clean, intuitive UI
- Responsive across devices

### Reliability
- Handle API errors gracefully

---

## 6. Technical Requirements

### Frontend
- React.js
- Hooks (useState, useEffect)
- Tailwind CSS or Bootstrap
- Responsive design

### Backend
- Node.js
- Express.js
- MVC folder structure

### Database
- MongoDB with Mongoose

---

## 7. Bonus Features (Optional)

- Pagination for student list
- Admin authentication (JWT)
- Dockerized setup

---

## 8. User Flow

1. Admin opens dashboard
2. Views student list
3. Searches or filters students
4. Adds / edits / deletes student
5. Backend updates database
6. UI reflects updated data

---

## 9. Assumptions & Constraints

### Assumptions
- Single admin user
- Internet connectivity available

### Constraints
- Completion within 3 days
- Must use MERN stack

---

## 10. Success Metrics

- All CRUD operations working
- Frontend and backend connected
- No critical bugs
- Clean UI and readable code

---

## 11. Deliverables

- GitHub repository (frontend + backend)
- README with setup instructions
- Demo video link

---

## 12. Evaluation Criteria

- Full‑stack connectivity
- Code quality and structure
- Error handling
- UI/UX quality

