const express = require("express");
const Expense = require("../models/Expense");
const { protect } = require("../middleware/authMiddleware");
const sendNotification = require("../utils/notificationHelper");
const router = express.Router();
const { admin } = require("../middleware/authMiddleware");

// POST /expense → Submit expense (Employee)
router.post("/", protect, async (req, res) => {
    try {
        const { month, year, amount, description } = req.body;

        const expense = await Expense.create({
            employee: req.user.id, // logged-in employee
            month,
            year,
            amount,
            description
        });

        res.json({ message: "Expense submitted", expense });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /expense → Get own expenses (Employee)
router.get("/", protect, async (req, res) => {
    try {
        const expenses = await Expense.find({ employee: req.user.id }).sort({ createdAt: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//Notification

router.put("/:id/approve", protect, admin, async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) return res.status(404).json({ message: "Not found" });

  expense.status = "approved";
  await expense.save();

  sendNotification(expense.employee, "Your expense was approved!");

  res.json({ message: "Expense approved" });
});

router.put("/:id/reject", protect, admin, async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) return res.status(404).json({ message: "Not found" });

  expense.status = "rejected";
  await expense.save();

  sendNotification(expense.employee, "Your expense was rejected!");

  res.json({ message: "Expense rejected" });
});

module.exports = router;
