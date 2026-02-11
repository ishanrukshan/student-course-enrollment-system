const Student = require("../models/Student");

// GET /api/analytics
const getAnalytics = async (req, res) => {
    try {
        // Students per course
        const perCourse = await Student.aggregate([
            { $group: { _id: "$course", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Status distribution
        const perStatus = await Student.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);

        // Enrollment trends by month
        const trends = await Student.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const trendData = trends.map((t) => ({
            month: `${t._id.year}-${String(t._id.month).padStart(2, "0")}`,
            count: t.count,
        }));

        res.json({
            perCourse: perCourse.map((c) => ({ course: c._id, count: c.count })),
            perStatus: perStatus.map((s) => ({ status: s._id, count: s.count })),
            trends: trendData,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getAnalytics };
