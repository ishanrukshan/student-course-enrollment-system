function SearchBar({ search, onSearchChange, courseFilter, onCourseFilterChange, courses }) {
    return (
        <div className="search-bar">
            <div className="search-bar-input-wrap">
                <svg className="search-bar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="input search-bar-input"
                />
            </div>
            <select
                value={courseFilter}
                onChange={(e) => onCourseFilterChange(e.target.value)}
                className="select search-bar-select"
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
