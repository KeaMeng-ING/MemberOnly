const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", (req, res) => {
  res.render("index", { title: "sdf", message: "Home" });
});

router.get("/user", userController.renderUser);
router.get("/sign-up", userController.renderSignUp);
router.post("/sign-up", userController.postSignUp);

module.exports = router;
