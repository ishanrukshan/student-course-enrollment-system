const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Student = require("./models/Student");

dotenv.config();

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

const statuses = ["Pending", "Active", "Completed"];

const newStudents = [
    { name: "Amaya Samarasinghe", email: "amaya.s@gmail.com", phone: "0711112233" },
    { name: "Buddhika Rathnayake", email: "buddhika.r@outlook.com", phone: "0722223344" },
    { name: "Charith Gunasekara", email: "charith.g@gmail.com", phone: "0733334455" },
    { name: "Deshani Abeywickrama", email: "deshani.a@yahoo.com", phone: "0744445566" },
    { name: "Eranga Jayalath", email: "eranga.j@gmail.com", phone: "0755556677" },
    { name: "Fathima Rizna", email: "fathima.r@outlook.com", phone: "0766667788" },
    { name: "Gayan Pradeep", email: "gayan.p@gmail.com", phone: "0777778899" },
    { name: "Hiruni Wijesekara", email: "hiruni.w@yahoo.com", phone: "0788889900" },
    { name: "Isuru Nanayakkara", email: "isuru.n@gmail.com", phone: "0799990011" },
    { name: "Janani Kumarasinghe", email: "janani.k@outlook.com", phone: "0700001122" },
    { name: "Kavindu Seneviratne", email: "kavindu.s@gmail.com", phone: "0711223344" },
    { name: "Lasitha Herath", email: "lasitha.h@yahoo.com", phone: "0722334455" },
    { name: "Maleesha Tennakoon", email: "maleesha.t@gmail.com", phone: "0733445566" },
    { name: "Nimali Gunawardena", email: "nimali.g@outlook.com", phone: "0744556677" },
    { name: "Oshadha Wickramasuriya", email: "oshadha.w@gmail.com", phone: "0755667788" },
    { name: "Pooja Ranaweera", email: "pooja.r@yahoo.com", phone: "0766778899" },
    { name: "Ranuka Senanayake", email: "ranuka.s@gmail.com", phone: "0777889900" },
    { name: "Shanika Ekanayake", email: "shanika.e@outlook.com", phone: "0788990011" },
    { name: "Thilina Karunarathne", email: "thilina.k@gmail.com", phone: "0799001122" },
    { name: "Udari Madushan", email: "udari.m@yahoo.com", phone: "0700112233" },
    { name: "Vimukthi Alwis", email: "vimukthi.a@gmail.com", phone: "0711334455" },
    { name: "Wathsala Peris", email: "wathsala.p@outlook.com", phone: "0722445566" },
    { name: "Yasas Abeysiri", email: "yasas.a@gmail.com", phone: "0733556677" },
    { name: "Zinara Mohideen", email: "zinara.m@yahoo.com", phone: "0744667788" },
    { name: "Anjali Siriwardena", email: "anjali.sw@gmail.com", phone: "0755778899" },
];

// Assign random course and status to each student
const students = newStudents.map((s) => ({
    ...s,
    course: courses[Math.floor(Math.random() * courses.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
}));

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✓ Connected to MongoDB");

        const before = await Student.countDocuments();
        await Student.insertMany(students);
        const after = await Student.countDocuments();

        console.log(`✓ Added ${students.length} new students`);
        console.log(`\n--- Summary ---`);
        console.log(`Before: ${before} students`);
        console.log(`After:  ${after} students`);

        process.exit(0);
    } catch (err) {
        console.error("✗ Failed:", err.message);
        process.exit(1);
    }
};

seed();
