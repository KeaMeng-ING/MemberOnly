const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("index", { user: req.user });
});
router.post("/join", userController.joinMember);
router.get("/user", userController.renderUser);
router.get("/sign-up", userController.renderSignUp);
router.post("/sign-up", userController.postSignUp);
router.get("/log-in", userController.renderLogin);
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/home", userController.renderHome);

router.get("/user/:id", userController.renderUserById);

module.exports = router;
