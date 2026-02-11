import { useState, useEffect } from "react";

import { getAllCourses, createCourse, updateCourse, deleteCourse } from "../api/studentApi";
import { useToast } from "../components/Toast";
import { useConfirm } from "../components/ConfirmModal";

function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [name, setName] = useState("");

    const toast = useToast();
    const confirm = useConfirm();

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const { data } = await getAllCourses();
            setCourses(data);
        } catch (err) {
            if (err.response?.status !== 401) toast.error("Failed to load courses.");
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            if (editingCourse) {
                await updateCourse(editingCourse._id, { name });
                toast.success("Course updated successfully.");
            } else {
                await createCourse({ name });
                toast.success("Course added successfully.");
            }
            setShowForm(false); setName(""); setEditingCourse(null); fetchCourses();
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong.");
        }
    };

    const handleDelete = async (course) => {
        const confirmed = await confirm({
            title: "Delete Course",
            message: `Are you sure you want to delete "${course.name}"? This action cannot be undone.`,
            confirmText: "Delete",
            type: "danger",
        });
        if (!confirmed) return;
        try {
            await deleteCourse(course._id);
            toast.success("Course deleted successfully.");
            fetchCourses();
        } catch {
            toast.error("Could not delete course.");
        }
    };

    return (
        <>
            <div className="page-header">
                <h1>Courses</h1>
                <button onClick={() => { setEditingCourse(null); setName(""); setShowForm(true); }} className="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Add Course
                </button>
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
                    <div className="modal" style={{ maxWidth: "400px" }}>
                        <div className="modal-header">
                            <h2>{editingCourse ? "Edit Course" : "Add Course"}</h2>
                            <button onClick={() => setShowForm(false)} className="btn btn-ghost" style={{ padding: "4px" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <label className="label">Course Name</label>
                                <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="e.g. Computer Science" autoFocus />
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingCourse ? "Update" : "Add"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="card"><div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div></div>
            ) : courses.length === 0 ? (
                <div className="card"><div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>No courses yet.</div></div>
            ) : (
                <div className="card">
                    <div className="table-scroll">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Course Name</th>
                                    <th style={{ width: "120px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((c) => (
                                    <tr key={c._id}>
                                        <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <span style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                                                </span>
                                                {c.name}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "4px" }}>
                                                <button onClick={() => { setEditingCourse(c); setName(c.name); setShowForm(true); }} className="btn btn-ghost" title="Edit">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(c)} className="btn btn-ghost" title="Delete" style={{ color: "#f87171" }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}

export default CoursesPage;
