const Student = require("../models/Student");

// Get all students (with optional search, filter, pagination, sorting)
// GET /api/students
const getStudents = async (req, res) => {
    try {
        const { search, course, page = 1, limit = 10, sortField = "createdAt", sortOrder = "desc" } = req.query;
        const filter = {};

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        if (course) {
            filter.course = course;
        }

        const total = await Student.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;

        const sort = {};
        sort[sortField] = sortOrder === "asc" ? 1 : -1;

        const students = await Student.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({ students, page: Number(page), totalPages, total });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get single student by ID
// GET /api/students/:id
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create a new student
// POST /api/students
const createStudent = async (req, res) => {
    try {
        const { name, email, phone, course, status } = req.body;

        // Check if this student is already enrolled in this course
        const existing = await Student.findOne({ email: email?.toLowerCase(), course });
        if (existing) {
            return res.status(400).json({ message: "This student is already enrolled in this course" });
        }

        const student = await Student.create({ name, email, phone, course, status });
        res.status(201).json(student);
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a student
// PUT /api/students/:id
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check for duplicate email+course combo if either is changing
        const newEmail = (req.body.email || student.email).toLowerCase();
        const newCourse = req.body.course || student.course;
        if (newEmail !== student.email || newCourse !== student.course) {
            const existing = await Student.findOne({ email: newEmail, course: newCourse, _id: { $ne: req.params.id } });
            if (existing) {
                return res.status(400).json({ message: "This student is already enrolled in this course" });
            }
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedStudent);
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a student
// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Bulk delete students
// POST /api/students/bulk-delete
const bulkDelete = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: "No student IDs provided" });
        }
        await Student.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: `Deleted ${ids.length} students` });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Bulk update status
// PUT /api/students/bulk-status
const bulkUpdateStatus = async (req, res) => {
    try {
        const { ids, status } = req.body;
        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: "No student IDs provided" });
        }
        await Student.updateMany({ _id: { $in: ids } }, { status });
        res.status(200).json({ message: `Updated ${ids.length} students to ${status}` });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all enrollments for a student by email
// GET /api/students/email/:email
const getStudentsByEmail = async (req, res) => {
    try {
        const students = await Student.find({ email: req.params.email }).sort({ createdAt: -1 });
        if (students.length === 0) {
            return res.status(404).json({ message: "No enrollments found for this email" });
        }
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    bulkDelete,
    bulkUpdateStatus,
    getStudentsByEmail,
};
