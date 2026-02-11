import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllStudents, getAllCourses, createStudent, updateStudent, deleteStudent,
    bulkDeleteStudents, bulkUpdateStatus,
} from "../api/studentApi";
import StudentTable from "../components/StudentTable";
import StudentForm from "../components/StudentForm";
import SearchBar from "../components/SearchBar";
import { useToast } from "../components/Toast";
import { useConfirm } from "../components/ConfirmModal";

function DashboardPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [courseFilter, setCourseFilter] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedIds, setSelectedIds] = useState([]);
    const toast = useToast();
    const confirm = useConfirm();

    useEffect(() => {
        getAllCourses()
            .then((res) => setCourses(res.data.map((c) => c.name)))
            .catch((err) => { if (err.response?.status === 401) navigate("/login"); });
    }, [navigate]);

    const fetchStudents = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await getAllStudents(search, courseFilter, page, 10, sortField, sortOrder);
            setStudents(data.students);
            setTotalPages(data.totalPages);
            setTotal(data.total);
            setSelectedIds([]);
        } catch (err) {
            if (err.response?.status === 401) { navigate("/login"); return; }
            toast.error("Failed to load students.");
        } finally { setLoading(false); }
    }, [search, courseFilter, page, sortField, sortOrder, navigate]);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);
    useEffect(() => { setPage(1); }, [search, courseFilter]);

    const handleSort = (field) => {
        if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        else { setSortField(field); setSortOrder("asc"); }
        setPage(1);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingStudent) {
                await updateStudent(editingStudent._id, formData);
                toast.success("Student updated successfully.");
            } else {
                await createStudent(formData);
                toast.success("Student added successfully.");
            }
            setShowForm(false); setEditingStudent(null); fetchStudents();
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong.");
        }
    };

    const handleDelete = async (student) => {
        const confirmed = await confirm({
            title: "Delete Student",
            message: `Are you sure you want to delete "${student.name}"? This action cannot be undone.`,
            confirmText: "Delete",
            type: "danger",
        });
        if (!confirmed) return;
        try {
            await deleteStudent(student._id);
            toast.success("Student deleted successfully.");
            fetchStudents();
        } catch {
            toast.error("Could not delete student.");
        }
    };

    const handleSelectToggle = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
    const handleSelectAll = () => students.every((s) => selectedIds.includes(s._id)) ? setSelectedIds([]) : setSelectedIds(students.map((s) => s._id));

    const handleBulkDelete = async () => {
        const confirmed = await confirm({
            title: "Bulk Delete",
            message: `Are you sure you want to delete ${selectedIds.length} selected record(s)? This action cannot be undone.`,
            confirmText: "Delete All",
            type: "danger",
        });
        if (!confirmed) return;
        try {
            await bulkDeleteStudents(selectedIds);
            toast.success(`Deleted ${selectedIds.length} records.`);
            fetchStudents();
        } catch {
            toast.error("Bulk delete failed.");
        }
    };

    const handleBulkStatus = async (status) => {
        try {
            await bulkUpdateStatus(selectedIds, status);
            toast.success(`Updated ${selectedIds.length} records to ${status}.`);
            fetchStudents();
        } catch {
            toast.error("Bulk status update failed.");
        }
    };

    const handleExportCSV = () => {
        if (students.length === 0) return;
        const headers = ["Name", "Email", "Phone", "Course", "Status"];
        const rows = students.map((s) => [s.name, s.email, s.phone, s.course, s.status]);
        const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "students.csv"; a.click();
        toast.info("CSV exported successfully.");
    };

    // Stat counts
    const activeCount = students.filter((s) => s.status === "Active").length;
    const pendingCount = students.filter((s) => s.status === "Pending").length;

    return (
        <>
            {/* Page header */}
            <div className="page-header">
                <h1>Dashboard</h1>
                <div className="page-header-actions">
                    <button onClick={handleExportCSV} disabled={students.length === 0} className="btn btn-outline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Export CSV
                    </button>
                    <button onClick={() => { setEditingStudent(null); setShowForm(true); }} className="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Add Student
                    </button>
                </div>
            </div>

            {/* Stat cards */}
            <div className="stat-cards">
                <div className="stat-card stat-card-blue">
                    <div className="stat-card-header">
                        <div className="stat-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                        <div className="stat-card-label">Total Students</div>
                    </div>
                    <div className="stat-card-value">{total.toLocaleString()}</div>
                    <div className="stat-card-trend">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></svg>
                        vs last month
                    </div>
                </div>
                <div className="stat-card stat-card-green">
                    <div className="stat-card-header">
                        <div className="stat-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <div className="stat-card-label">Active</div>
                    </div>
                    <div className="stat-card-value">{activeCount.toLocaleString()}</div>
                    <div className="stat-card-trend">
                        {total > 0 ? Math.round((activeCount / total) * 100) : 0}%
                    </div>
                </div>
                <div className="stat-card stat-card-amber">
                    <div className="stat-card-header">
                        <div className="stat-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        </div>
                        <div className="stat-card-label">Pending</div>
                    </div>
                    <div className="stat-card-value">{pendingCount.toLocaleString()}</div>
                    <div className="stat-card-trend">
                        {total > 0 ? Math.round((pendingCount / total) * 100) : 0}%
                    </div>
                </div>
                <div className="stat-card stat-card-purple">
                    <div className="stat-card-header">
                        <div className="stat-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                        </div>
                        <div className="stat-card-label">Courses</div>
                    </div>
                    <div className="stat-card-value">{courses.length}</div>
                    <div className="stat-card-trend">
                        +{courses.length} available
                    </div>
                </div>
            </div>

            {/* Search */}
            <SearchBar search={search} onSearchChange={setSearch} courseFilter={courseFilter} onCourseFilterChange={setCourseFilter} courses={courses} />

            {/* Bulk bar */}
            {selectedIds.length > 0 && (
                <div className="bulk-bar">
                    <span className="bulk-bar-count">{selectedIds.length} selected</span>
                    <span className="bulk-bar-sep"></span>
                    <button onClick={handleBulkDelete} className="btn btn-danger" style={{ padding: "4px 10px", fontSize: "12px" }}>Delete</button>
                    <span className="bulk-bar-sep"></span>
                    <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Set status:</span>
                    <button onClick={() => handleBulkStatus("Pending")} className="btn btn-ghost" style={{ fontSize: "12px" }}>Pending</button>
                    <button onClick={() => handleBulkStatus("Active")} className="btn btn-ghost" style={{ fontSize: "12px" }}>Active</button>
                    <button onClick={() => handleBulkStatus("Completed")} className="btn btn-ghost" style={{ fontSize: "12px" }}>Completed</button>
                </div>
            )}

            {/* Table */}
            <StudentTable
                students={students} loading={loading}
                onEdit={(s) => { setEditingStudent(s); setShowForm(true); }} onDelete={handleDelete}
                sortField={sortField} sortOrder={sortOrder} onSort={handleSort}
                selectedIds={selectedIds} onSelectToggle={handleSelectToggle} onSelectAll={handleSelectAll}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px" }}>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Page {page} of {totalPages}</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-outline">Previous</button>
                        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="btn btn-outline">Next</button>
                    </div>
                </div>
            )}

            {showForm && <StudentForm student={editingStudent} onSubmit={handleFormSubmit} onClose={() => { setShowForm(false); setEditingStudent(null); }} />}
        </>
    );
}

export default DashboardPage;
