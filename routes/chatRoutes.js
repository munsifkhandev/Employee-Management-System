const express = require("express");
const router = express.Router();
const { handleChatCommand } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, handleChatCommand);

module.exports = router;
