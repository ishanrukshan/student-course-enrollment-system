const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email address",
            ],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            match: [/^\d+$/, "Phone number must contain digits only"],
        },
        course: {
            type: String,
            required: [true, "Course is required"],
            trim: true,
        },
        status: {
            type: String,
            enum: {
                values: ["Pending", "Active", "Completed"],
                message: "Status must be Pending, Active, or Completed",
            },
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Student", studentSchema);
