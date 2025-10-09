const Expense = require("../models/Expense");

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

module.exports = {
  addExpense,
  getMyExpense,
};
