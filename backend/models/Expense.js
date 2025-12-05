const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
