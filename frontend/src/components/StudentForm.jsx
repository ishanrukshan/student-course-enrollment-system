import { useState, useEffect } from "react";
import { getAllCourses } from "../api/studentApi";

function StudentForm({ student, onSubmit, onClose }) {
    const [form, setForm] = useState({
        name: "", email: "", phone: "", course: "", status: "Pending",
    });
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        getAllCourses().then((res) => setCourses(res.data)).catch(() => { });
    }, []);

    useEffect(() => {
        if (student) {
            setForm({
                name: student.name || "",
                email: student.email || "",
                phone: student.phone || "",
                course: student.course || "",
                status: student.status || "Pending",
            });
        }
    }, [student]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <h2>{student ? "Edit Student" : "Add Student"}</h2>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: "4px" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                            <label className="label">Name</label>
                            <input name="name" value={form.name} onChange={handleChange} required className="input" placeholder="Enter student name" />
                        </div>
                        <div>
                            <label className="label">Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required className="input" placeholder="student@example.com" />
                        </div>
                        <div>
                            <label className="label">Phone</label>
                            <input name="phone" value={form.phone} onChange={handleChange} required className="input" placeholder="Phone number" />
                        </div>
                        <div>
                            <label className="label">Course</label>
                            <select name="course" value={form.course} onChange={handleChange} required className="select">
                                <option value="">Select a course</option>
                                {courses.map((c) => (
                                    <option key={c._id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">Status</label>
                            <select name="status" value={form.status} onChange={handleChange} className="select">
                                <option value="Pending">Pending</option>
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            {student ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default StudentForm;
