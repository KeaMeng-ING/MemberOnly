const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const passport = require("passport");

router.post("/newMessage", messageController.newMessage);

module.exports = router;
