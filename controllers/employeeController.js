const Employee = require("../models/Employee");

const bcrypt = require("bcryptjs");

const registerEmployee = async (req, res) => {
  try {
    const { name, employeeId, password } = req.body;

    if (!name || !employeeId || password) {
      return res.status(400).json({
        success: falase,
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

module.exports = {
  registerEmployee,
};
