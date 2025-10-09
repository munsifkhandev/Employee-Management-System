const axios = require("axios");
const mongoose = require("mongoose");
const Expense = require("../models/Expense");

const handleChatCommand = async (req, res) => {
  const { command } = req.body;
  const employeeId = req.employee.id;

  if (!command) {
    return res.status(400).json({ error: "Command is required." });
  }

  const systemPrompt = `You are an intelligent assistant for a personal Expense Management System. Your job is to understand the user's command and convert it into a structured JSON object.

  The possible intents are:
  - "add_expense"
  - "get_my_expenses"
  - "get_summary"
  - "update_expense_by_voucher"
  - "update_expense_by_description"
  - "delete_expense_by_voucher"
  - "unknown"

  Follow these rules STRICTLY:
  1. For "add_expense", you MUST extract "amount", "category", and "description".
  2. For "update_expense_by_voucher", you MUST extract the "voucherNumber" and a "data" object with the fields to update.
  3. For "update_expense_by_description", you MUST extract a "search_term" and an "update_data" object.
  4. For "delete_expense_by_voucher", you MUST extract the "voucherNumber".
  5. Your response MUST be ONLY the JSON object and nothing else.

  Example 1 (Add):
  User: "I spent 1200 on dinner"
  JSON: { "intent": "add_expense", "data": { "amount": 1200, "category": "Food", "description": "dinner" } }

  Example 2 (Update by Voucher):
  User: "Update expense with voucher V-101 and set amount to 1500"
  JSON: { "intent": "update_expense_by_voucher", "voucherNumber": "V-101", "data": { "amount": 1500 } }

  Example 3 (Update by Description):
  User: "change my expense at imtiaz to 4500"
  JSON: { "intent": "update_expense_by_description", "search_term": "imtiaz", "update_data": { "amount": 4500 } }
  
  Example 4 (Delete):
  User: "delete expense with voucher V-101"
  JSON: { "intent": "delete_expense_by_voucher", "voucherNumber": "V-101" }`;

  try {
    const apiResponse = await axios.post(
      process.env.CHATBOT_API_URL,
      {
        model: "LongCat-Flash-Chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: command },
        ],
      },
      { headers: { Authorization: `Bearer ${process.env.CHATBOT_API_KEY}` } }
    );

    const aiResponseString = apiResponse.data.choices[0].message.content;
    const action = JSON.parse(aiResponseString);

    switch (action.intent) {
      case "add_expense":
        const newExpense = new Expense({
          employee: employeeId,
          ...action.data,
        });
        const savedExpense = await newExpense.save();
        res.json({
          reply: "I have added the expense for you.",
          data: savedExpense,
        });
        break;

      case "get_my_expenses":
        const expenses = await Expense.find({ employee: employeeId });
        res.json({ reply: "Here are your expenses:", data: expenses });
        break;

      case "get_summary":
        const summary = await Expense.aggregate([
          { $match: { employee: new mongoose.Types.ObjectId(employeeId) } },
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
        res.json({
          reply: "Here is your expense summary:",
          data: summary[0],
        });
        break;

      case "update_expense_by_voucher":
        const updatedExpenseByVoucher = await Expense.findOneAndUpdate(
          { voucherNumber: action.voucherNumber, employee: employeeId },
          action.data,
          { new: true }
        );
        if (!updatedExpenseByVoucher) {
          return res.json({
            reply: `Sorry, I couldn't find an expense with voucher number ${action.voucherNumber}.`,
          });
        }
        res.json({
          reply: "I have updated the expense for you.",
          data: updatedExpenseByVoucher,
        });
        break;

      case "update_expense_by_description":
        const expenseToUpdate = await Expense.findOne({
          employee: employeeId,
          description: new RegExp(action.search_term, "i"),
        }).sort({ date: -1 });

        if (!expenseToUpdate) {
          return res.json({
            reply: `Sorry, I couldn't find a recent expense matching '${action.search_term}'.`,
          });
        }

        const updatedExpenseByDesc = await Expense.findByIdAndUpdate(
          expenseToUpdate._id,
          action.update_data,
          { new: true }
        );
        res.json({
          reply: `Okay, I've updated your recent expense matching '${action.search_term}'.`,
          data: updatedExpenseByDesc,
        });
        break;

      case "delete_expense_by_voucher":
        const deletedExpense = await Expense.findOneAndDelete({
          voucherNumber: action.voucherNumber,
          employee: employeeId,
        });
        if (!deletedExpense) {
          return res.json({
            reply: `Sorry, I couldn't find an expense with voucher number ${action.voucherNumber}.`,
          });
        }
        res.json({
          reply: `Expense with voucher ${action.voucherNumber} has been deleted.`,
        });
        break;

      default:
        res.json({ reply: "Sorry, I couldn't understand that command." });
    }
  } catch (error) {
    console.error("Chatbot logic error:", error);
    res
      .status(500)
      .json({ error: "Sorry, something went wrong with the AI assistant." });
  }
};

module.exports = { handleChatCommand };
