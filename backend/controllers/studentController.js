const Student = require("../models/Student");

// @desc    Get all students (with optional search & filter)
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res) => {
    try {
        const { search, course } = req.query;
        const filter = {};

        // Search by name (case-insensitive partial match)
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        // Filter by course
        if (course) {
            filter.course = course;
        }

        const students = await Student.find(filter).sort({ createdAt: -1 });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Public
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

// @desc    Create a new student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res) => {
    try {
        const { name, email, phone, course, status } = req.body;

        // Check for duplicate email
        const existingStudent = await Student.findOne({ email: email?.toLowerCase() });
        if (existingStudent) {
            return res.status(400).json({ message: "A student with this email already exists" });
        }

        const student = await Student.create({ name, email, phone, course, status });
        res.status(201).json(student);
    } catch (error) {
        // Handle Mongoose validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check for duplicate email if email is being changed
        if (req.body.email && req.body.email.toLowerCase() !== student.email) {
            const existingStudent = await Student.findOne({ email: req.body.email.toLowerCase() });
            if (existingStudent) {
                return res.status(400).json({ message: "A student with this email already exists" });
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

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Public
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

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};
