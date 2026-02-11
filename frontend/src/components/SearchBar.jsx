function SearchBar({ search, onSearchChange, courseFilter, onCourseFilterChange, courses }) {
    return (
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1, position: "relative" }}>
                <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "var(--text-muted)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="input"
                    style={{ paddingLeft: "36px" }}
                />
            </div>
            <select
                value={courseFilter}
                onChange={(e) => onCourseFilterChange(e.target.value)}
                className="select"
                style={{ width: "200px", flex: "none" }}
            >
                <option value="">All Courses</option>
                {courses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
        </div>
    );
}

export default SearchBar;
