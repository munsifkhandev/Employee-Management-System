const express = require("express");
const {
  registerEmployee,
  loginEmployee,
  getMyProfile,
} = require("../controllers/employeeController");

const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/register", registerEmployee);
router.post("/login", loginEmployee);

router.get("/me", authMiddleware, getMyProfile);

module.exports = router;
