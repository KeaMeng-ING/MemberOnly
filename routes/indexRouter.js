const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");
const passport = require("passport");
const methodOverride = require("method-override");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(methodOverride("_method"));
router.get("/", (req, res) => {
  if (req.user) {
    return res.redirect("/home");
  }
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
    failureRedirect: "/log-in?error=true",
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

router.delete("/delete/:headline", messageController.deleteMessage);
router.post("/editMessage", messageController.editMessage);
router.post("/newMessage", messageController.newMessage);

router.get("/home", messageController.getMessages);
router.get("/home/page/:page", messageController.getMessages);

router.get("/user/:id", userController.renderUserById);

module.exports = router;
