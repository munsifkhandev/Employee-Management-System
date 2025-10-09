const Expense = require("../models/Expense");
const mongoose = require("mongoose");
const addExpense = async (req, res) => {
  try {
    const { category, amount, description, date, voucherNumber, modeOfTravel } =
      req.body;
    const employeeId = req.employee.id;
    const newExpense = new Expense({
      employee: employeeId,
      category,
      amount,
      description,
      date,
      voucherNumber,
      modeOfTravel,
    });

    const savedExpense = await newExpense.save();
    return res.status(201).json({
      success: true,
      data: savedExpense,
      message: "Successfully Added Expense.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error Adding Expense",
    });
  }
};

const getMyExpense = async (req, res) => {
  try {
    const myExpenses = await Expense.find({ employee: req.employee.id });
    return res.status(200).json({
      success: true,
      data: myExpenses,
      message: "Successfully Fetched Details.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error Fetching Your Details",
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(400).json({
        success: false,
        message: "No Expense , Please Add the Expense First.. ",
      });
    }
    if (expense.employee.toString() !== req.employee.id) {
      return res.status(401).json({
        success: false,
        message: "User not Authorize..",
      });
    }
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Expense Updated Successfullyy...",
    });
  } catch (error) {
    console.error("Error during expense update:", error); // <-- ADD THIS LINE

    return res.status(500).json({
      success: false,
      message: "Expense Updataion Failed...",
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found." });
    }

    if (expense.employee.toString() !== req.employee.id) {
      return res.status(401).json({ error: "User not authorized." });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense removed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting expense: " + error.message });
  }
};

const getMySummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      { $match: { employee: new mongoose.Types.ObjectId(req.employee.id) } },
      {
        $facet: {
          byCategory: [
            {
              $group: {
                _id: "$category",
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
          ],
          overallTotal: [
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({
      success: false,
      data: summary,
      message: "Here is yourr Expense Summary..",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error fetching summary: " + error.message });
  }
};

module.exports = {
  addExpense,
  getMyExpense,
  updateExpense,
  deleteExpense,
  getMySummary,
};
