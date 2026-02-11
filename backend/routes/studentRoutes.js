const express = require("express");
const router = express.Router();
const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    bulkDelete,
    bulkUpdateStatus,
    getStudentsByEmail,
} = require("../controllers/studentController");

// Bulk routes (must be before /:id routes)
router.post("/bulk-delete", bulkDelete);
router.put("/bulk-status", bulkUpdateStatus);

// Email lookup
router.get("/email/:email", getStudentsByEmail);

// Standard CRUD
router.route("/").get(getStudents).post(createStudent);
router.route("/:id").get(getStudentById).put(updateStudent).delete(deleteStudent);

module.exports = router;
