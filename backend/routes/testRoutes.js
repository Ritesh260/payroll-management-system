const express = require("express");
const { protect, admin, employee } = require("../middleware/authMiddleware");
const router = express.Router();

// Admin route
router.get("/admin", protect, admin, (req, res) => {
    res.json({ message: `Hello Admin ${req.user.name}` });
});

// Employee route
router.get("/employee", protect, employee, (req, res) => {
    res.json({ message: `Hello Employee ${req.user.name}` });
});

module.exports = router;
