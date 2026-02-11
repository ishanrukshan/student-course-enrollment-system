const Course = require("../models/Course");

// Get all courses
// GET /api/courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ name: 1 });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create a course
// POST /api/courses
const createCourse = async (req, res) => {
    try {
        const { name } = req.body;
        const existing = await Course.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: "Course already exists" });
        }
        const course = await Course.create({ name });
        res.status(201).json(course);
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a course
// PUT /api/courses/:id
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const { name } = req.body;
        const existing = await Course.findOne({ name, _id: { $ne: req.params.id } });
        if (existing) {
            return res.status(400).json({ message: "A course with this name already exists" });
        }

        course.name = name;
        await course.save();
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a course
// DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Course deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getCourses, createCourse, updateCourse, deleteCourse };
