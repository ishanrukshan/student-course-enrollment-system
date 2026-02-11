import { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    LineChart, Line,
} from "recharts";
import { getAnalytics } from "../api/studentApi";
import { useToast } from "../components/Toast";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#ef4444"];

const darkTooltipStyle = {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "13px",
};

function AnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: analytics } = await getAnalytics();
                setData(analytics);
            } catch (err) {
                // 401 is handled globally by the Axios interceptor
                if (err.response?.status !== 401) {
                    toast.error("Failed to load analytics data.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>;
    if (!data) return null;

    return (
        <>
            <div className="page-header">
                <h1>Analytics</h1>
            </div>

            {/* Students Per Course */}
            <div className="chart-card" style={{ marginBottom: "16px" }}>
                <h3>Students Per Course</h3>
                {data.perCourse.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No data yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.perCourse}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="course" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                            <Tooltip contentStyle={darkTooltipStyle} cursor={{ fill: "rgba(59,130,246,0.08)" }} />
                            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="chart-grid">
                {/* Status Distribution */}
                <div className="chart-card">
                    <h3>Status Distribution</h3>
                    {data.perStatus.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={data.perStatus} dataKey="count" nameKey="status" cx="50%" cy="45%" outerRadius={75} label={({ status, count }) => `${status} (${count})`} labelLine={false}>
                                    {data.perStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={darkTooltipStyle} />
                                <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Enrollment Trends */}
                <div className="chart-card">
                    <h3>Enrollment Trends</h3>
                    {data.trends.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No data yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={data.trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                                <Tooltip contentStyle={darkTooltipStyle} />
                                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </>
    );
}

export default AnalyticsPage;
