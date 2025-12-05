const mongoose = require("mongoose");

const salarySlipSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    basic: { type: Number, required: true },
    hra: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("SalarySlip", salarySlipSchema);
