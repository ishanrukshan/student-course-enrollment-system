const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("./models/Course");
const Student = require("./models/Student");

dotenv.config();

// ===== Course data =====
const courses = [
    "Information Technology",
    "Computer Science",
    "Software Engineering",
    "Data Science",
    "Cyber Security",
    "Artificial Intelligence",
    "Network Engineering",
    "Business Information Systems",
];

// ===== Student enrollment data =====
const students = [
    { name: "Ishan Rukshan", email: "ishan.rukshan@gmail.com", phone: "0771234567", course: "Computer Science", status: "Active" },
    { name: "Kavindi Perera", email: "kavindi.perera@gmail.com", phone: "0712345678", course: "Software Engineering", status: "Active" },
    { name: "Nuwan Silva", email: "nuwan.silva@outlook.com", phone: "0761234567", course: "Data Science", status: "Active" },
    { name: "Tharindu Fernando", email: "tharindu.f@yahoo.com", phone: "0751234567", course: "Information Technology", status: "Pending" },
    { name: "Dilini Jayawardena", email: "dilini.j@gmail.com", phone: "0781234567", course: "Cyber Security", status: "Active" },
    { name: "Kasun Bandara", email: "kasun.bandara@gmail.com", phone: "0701234567", course: "Artificial Intelligence", status: "Active" },
    { name: "Sachini Weerasinghe", email: "sachini.w@outlook.com", phone: "0721234567", course: "Network Engineering", status: "Completed" },
    { name: "Ravindu Dissanayake", email: "ravindu.d@gmail.com", phone: "0741234567", course: "Computer Science", status: "Pending" },
    { name: "Nethmi Fonseka", email: "nethmi.fonseka@gmail.com", phone: "0731234567", course: "Software Engineering", status: "Active" },
    { name: "Ashan Gamage", email: "ashan.gamage@yahoo.com", phone: "0791234567", course: "Data Science", status: "Completed" },
    { name: "Dinusha Rajapaksa", email: "dinusha.r@gmail.com", phone: "0711234568", course: "Business Information Systems", status: "Active" },
    { name: "Chamara Wickramasinghe", email: "chamara.w@outlook.com", phone: "0761234568", course: "Information Technology", status: "Active" },
    { name: "Hasini Kumari", email: "hasini.kumari@gmail.com", phone: "0771234568", course: "Cyber Security", status: "Pending" },
    { name: "Lakshan De Silva", email: "lakshan.ds@gmail.com", phone: "0751234568", course: "Artificial Intelligence", status: "Active" },
    { name: "Sanduni Madushani", email: "sanduni.m@yahoo.com", phone: "0781234568", course: "Computer Science", status: "Active" },
    { name: "Pasan Liyanage", email: "pasan.liyanage@gmail.com", phone: "0701234568", course: "Software Engineering", status: "Completed" },
    { name: "Imashi Karunaratne", email: "imashi.k@gmail.com", phone: "0721234568", course: "Network Engineering", status: "Active" },
    { name: "Thisara Mendis", email: "thisara.mendis@outlook.com", phone: "0741234568", course: "Data Science", status: "Pending" },
    { name: "Senuri Herath", email: "senuri.herath@gmail.com", phone: "0731234568", course: "Business Information Systems", status: "Active" },
    { name: "Dulaj Pathirana", email: "dulaj.p@yahoo.com", phone: "0791234568", course: "Information Technology", status: "Active" },
    // Multi-enrollment students (same email, different courses)
    { name: "Ishan Rukshan", email: "ishan.rukshan@gmail.com", phone: "0771234567", course: "Artificial Intelligence", status: "Pending" },
    { name: "Kavindi Perera", email: "kavindi.perera@gmail.com", phone: "0712345678", course: "Data Science", status: "Active" },
    { name: "Nuwan Silva", email: "nuwan.silva@outlook.com", phone: "0761234567", course: "Cyber Security", status: "Pending" },
    { name: "Dilini Jayawardena", email: "dilini.j@gmail.com", phone: "0781234567", course: "Software Engineering", status: "Completed" },
    { name: "Kasun Bandara", email: "kasun.bandara@gmail.com", phone: "0701234567", course: "Computer Science", status: "Active" },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✓ Connected to MongoDB");

        // Seed courses
        await Course.deleteMany({});
        const courseDocs = courses.map((name) => ({ name }));
        await Course.insertMany(courseDocs);
        console.log(`✓ Seeded ${courseDocs.length} courses`);

        // Seed student enrollments
        await Student.deleteMany({});
        await Student.insertMany(students);
        console.log(`✓ Seeded ${students.length} student enrollments`);

        // Summary
        const uniqueStudents = [...new Set(students.map((s) => s.email))].length;
        const activeCount = students.filter((s) => s.status === "Active").length;
        const pendingCount = students.filter((s) => s.status === "Pending").length;
        const completedCount = students.filter((s) => s.status === "Completed").length;

        console.log("\n--- Seed Summary ---");
        console.log(`Courses:       ${courseDocs.length}`);
        console.log(`Enrollments:   ${students.length}`);
        console.log(`Unique students: ${uniqueStudents}`);
        console.log(`Active: ${activeCount} | Pending: ${pendingCount} | Completed: ${completedCount}`);

        process.exit(0);
    } catch (err) {
        console.error("✗ Seed failed:", err.message);
        process.exit(1);
    }
};

seed();
