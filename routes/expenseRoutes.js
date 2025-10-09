const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  addExpense,
  getMyExpense,
} = require("../controllers/expenseController");

router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getMyExpense);

module.exports = router;
