const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Is main koi token nahi hai, Pehly Token la ke do..",
    });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.employee = decoded.exployee;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Invalid Token..",
    });
  }
};

module.exports = authMiddleware;
