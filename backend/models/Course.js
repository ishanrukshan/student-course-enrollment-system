const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Course name is required"],
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Course", courseSchema);
