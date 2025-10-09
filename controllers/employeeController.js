const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerEmployee = async (req, res) => {
  try {
    const { name, employeeId, password } = req.body;

    if (!name || !employeeId || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required..",
      });
    }

    const employeeExists = await Employee.findOne({ employeeId });
    if (employeeExists) {
      return res.status(400).json({
        success: false,
        message: "Employee with this Employee ID already Exists...",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newEmployee = new Employee({
      name: name,
      employeeId: employeeId,
      password: hashedPassword,
    });

    const savedEmployee = await newEmployee.save();
    return res.status(201).json({
      success: true,
      data: savedEmployee,
      message: "Employee created Successfullyy..",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An Error Occurred while Registering the User..",
    });
  }
};

const loginEmployee = async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Invalid Employee Details",
      });
    }

    const matchPassword = await bcrypt.compare(password, employee.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid User Details..",
      });
    }

    const payload = {
      employee: {
        id: employee.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      success: true,
      message: "Logged In Successfullyyy...",
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to Login. Server Error. Try Again later..",
    });
  }
};

module.exports = {
  registerEmployee,
  loginEmployee,
};
