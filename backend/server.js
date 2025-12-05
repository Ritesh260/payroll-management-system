require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes"); 
const testRoutes = require("./routes/testRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes); 
app.use("/test", testRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/expense", expenseRoutes);
app.use("/users", userRoutes);
app.use("/api/notifications", require("./routes/notificationRoutes"));


// Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
 