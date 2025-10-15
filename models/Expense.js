const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  category: {
    type: String,
    required: true, 
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  voucherNumber: {
    type: String,
  },
  modeOfTravel: {
    type: String,
  },
});
module.exports = mongoose.model("Expense", expenseSchema);
