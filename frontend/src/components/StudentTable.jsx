import { Link } from "react-router-dom";

const AVATAR_COLORS = ["avatar-blue", "avatar-green", "avatar-purple", "avatar-pink", "avatar-amber"];

function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function getBadgeClass(status) {
    if (status === "Active") return "badge badge-active";
    if (status === "Pending") return "badge badge-pending";
    return "badge badge-completed";
}

function StudentTable({ students, loading, onEdit, onDelete, sortField, sortOrder, onSort, selectedIds, onSelectToggle, onSelectAll }) {
    if (loading) {
        return (
            <div className="card">
                <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
                    Loading...
                </div>
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <div className="card">
                <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
                    No students found.
                </div>
            </div>
        );
    }

    const columns = [
        { key: "name", label: "Student", className: "" },
        { key: "email", label: "Email", className: "hide-mobile" },
        { key: "phone", label: "Phone", className: "hide-mobile" },
        { key: "course", label: "Course", className: "hide-sm" },
        { key: "status", label: "Status", className: "" },
    ];

    const getSortArrow = (key) => {
        if (sortField !== key) return "";
        return sortOrder === "asc" ? " ▲" : " ▼";
    };

    const allSelected = students.length > 0 && students.every((s) => selectedIds.includes(s._id));

    return (
        <div className="card">
            <div className="table-scroll">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: "40px" }}>
                                <input type="checkbox" className="checkbox" checked={allSelected} onChange={() => onSelectAll()} />
                            </th>
                            {columns.map((col) => (
                                <th key={col.key} className={col.className} onClick={() => onSort(col.key)}>
                                    {col.label}{getSortArrow(col.key)}
                                </th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s) => (
                            <tr key={s._id} style={selectedIds.includes(s._id) ? { background: "var(--accent-glow)" } : {}}>
                                <td>
                                    <input type="checkbox" className="checkbox" checked={selectedIds.includes(s._id)} onChange={() => onSelectToggle(s._id)} />
                                </td>
                                <td>
                                    <Link to={`/students/${encodeURIComponent(s.email)}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                                        <div className={`avatar ${getAvatarColor(s.name)}`}>{getInitials(s.name)}</div>
                                        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{s.name}</span>
                                    </Link>
                                </td>
                                <td className="hide-mobile">{s.email}</td>
                                <td className="hide-mobile">{s.phone}</td>
                                <td className="hide-sm">{s.course}</td>
                                <td>
                                    <span className={getBadgeClass(s.status)}>
                                        <span className="badge-dot"></span>
                                        {s.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: "flex", gap: "4px" }}>
                                        <button onClick={() => onEdit(s)} className="btn btn-ghost" title="Edit">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </button>
                                        <button onClick={() => onDelete(s)} className="btn btn-ghost" title="Delete" style={{ color: "#f87171" }}>
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
    );
}

export default StudentTable;
