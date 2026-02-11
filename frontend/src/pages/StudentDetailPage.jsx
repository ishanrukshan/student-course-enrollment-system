import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentsByEmail } from "../api/studentApi";

function StudentDetailPage() {
    const { email } = useParams();
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await getStudentsByEmail(email);
                setEnrollments(data);
            } catch (err) {
                if (err.response?.status === 401) { navigate("/login"); return; }
                setError(err.response?.data?.message || "Failed to load data.");
            } finally { setLoading(false); }
        };
        fetch();
    }, [email, navigate]);

    const student = enrollments[0] || {};

    const getBadgeClass = (status) => {
        if (status === "Active") return "badge badge-active";
        if (status === "Pending") return "badge badge-pending";
        return "badge badge-completed";
    };

    if (loading) return <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>;
    if (error) return <div style={{ padding: "48px", textAlign: "center", color: "#f87171" }}>{error}</div>;

    const initials = (student.name || "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

    return (
        <>
            <div className="page-header">
                <h1>Student Detail</h1>
                <button onClick={() => navigate("/")} className="btn btn-outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                    Back
                </button>
            </div>

            {/* Student info card */}
            <div className="card" style={{ marginBottom: "16px" }}>
                <div className="card-body" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div className="avatar avatar-purple" style={{ width: "56px", height: "56px", fontSize: "20px", borderRadius: "14px" }}>{initials}</div>
                    <div>
                        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>{student.name}</h2>
                        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "2px" }}>{student.email}</p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{student.phone} · {enrollments.length} enrollment(s)</p>
                    </div>
                </div>
            </div>

            {/* Enrollment history */}
            <div className="card">
                <div className="card-header"><h2>Enrollment History</h2></div>
                <div className="table-scroll">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Status</th>
                                <th>Enrolled On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map((e) => (
                                <tr key={e._id}>
                                    <td style={{ color: "var(--text-primary)", fontWeight: 500 }}>{e.course}</td>
                                    <td>
                                        <span className={getBadgeClass(e.status)}>
                                            <span className="badge-dot"></span>
                                            {e.status}
                                        </span>
                                    </td>
                                    <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default StudentDetailPage;
