const express = require("express");
const connectDB = require("./config/db");

const employeeRoutes = require("./routes/employeeRoutes");

require("dotenv").config();
connectDB();

const app = express();

const PORT = process.env.PORT || 6655;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Congrats your Expense Management System API is working Perfectly.."
  );
});

app.use("/api/employee", employeeRoutes);

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
