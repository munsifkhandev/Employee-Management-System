const express = require("express");
const connectDB = require("./config/db");

const employeeRoutes = require("./routes/employeeRoutes");

const expenseRoutes = require("./routes/expenseRoutes");

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

app.use("/api/employees", employeeRoutes);
app.use("/api/expenses", expenseRoutes);

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
