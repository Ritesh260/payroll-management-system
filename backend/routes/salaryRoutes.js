const express = require("express");
const SalarySlip = require("../models/SalarySlip");
const Notification = require("../models/Notification");
const { protect, admin } = require("../middleware/authMiddleware");
const generateSalarySlipPDF = require("../utils/salarySlipPDF");
const router = express.Router();

/* -----------------------------
   EMPLOYEE – GET OWN SLIPS
-------------------------------- */
router.get("/my-slips", protect, async (req, res) => {
  try {
    if (req.user.role !== "employee")
      return res.status(403).json({ message: "Not allowed" });

    const slips = await SalarySlip.find({ employee: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(slips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   CREATE SALARY SLIP (ADMIN)
-------------------------------- */
router.post("/", protect, admin, async (req, res) => {
  try {
    const { employee, month, year, basic, hra, allowances, deductions, netSalary } = req.body;

    const slip = await SalarySlip.create({
      employee,
      month,
      year,
      basic,
      hra,
      allowances,
      deductions,
      netSalary,
    });

    await Notification.create({
      user: slip.employee,
      message: `New salary slip for ${slip.month} ${slip.year}`,
    });

    res.json({ message: "Salary slip created", slip });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   UPDATE SLIP (ADMIN)
-------------------------------- */
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const slip = await SalarySlip.findById(req.params.id);

    if (!slip) return res.status(404).json({ message: "Slip not found" });

    Object.assign(slip, req.body);
    await slip.save();

    await Notification.create({
      user: slip.employee,
      message: `Salary slip updated for ${slip.month} ${slip.year}`,
    });

    res.json({ message: "Updated", slip });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   ADMIN – GET ALL SLIPS
-------------------------------- */
router.get("/", protect, admin, async (req, res) => {
  try {
    const slips = await SalarySlip.find().populate("employee", "name email");
    res.json(slips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   GET SINGLE SLIP (ADMIN + EMPLOYEE OWN)
-------------------------------- */
router.get("/:id", protect, async (req, res) => {
  try {
    const slip = await SalarySlip.findById(req.params.id).populate(
      "employee",
      "name email"
    );

    if (!slip) return res.status(404).json({ message: "Slip not found" });

    if (
      req.user.role === "employee" &&
      slip.employee._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json(slip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   GET PDF FOR A SALARY SLIP
   (Employee + Admin)
-------------------------------- */
router.get("/:id/pdf", protect, async (req, res) => {
  try {
    const slip = await SalarySlip.findById(req.params.id).populate(
      "employee",
      "name email"
    );

    if (!slip) return res.status(404).json({ message: "Slip not found" });

    // Employee can only access their own slip
    if (req.user.role === "employee" &&
        slip.employee._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // PDF generation
    generateSalarySlipPDF(slip, res);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -----------------------------
   DELETE SLIP (ADMIN)
-------------------------------- */
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const del = await SalarySlip.findByIdAndDelete(req.params.id);

    if (!del) return res.status(404).json({ message: "Slip not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
