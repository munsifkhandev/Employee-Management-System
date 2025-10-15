const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  addExpense,
  getMyExpense,
  updateExpense,
  deleteExpense,
  getMySummary,
  addBulkExpenses,
} = require("../controllers/expenseController");

router.get("/summary", authMiddleware, getMySummary);

router.post("/", authMiddleware, addExpense);
router.post("/bulk", authMiddleware, addBulkExpenses);
router.get("/", authMiddleware, getMyExpense);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
