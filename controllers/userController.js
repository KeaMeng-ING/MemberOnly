// controllers/userController.js

const queries = require("../db/queries");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const userController = {
  async renderSignUp(req, res) {
    try {
      res.render("sign-up", { title: "Sign Up" });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async postSignUp(req, res) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const { firstName, lastName, username, email } = req.body;

      await queries.createUser(
        firstName,
        lastName,
        username,
        email,
        hashedPassword
      );

      console.log("User created");
      res.redirect("/");
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async renderLogin(req, res) {
    try {
      res.render("log-in");
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async renderUser(req, res) {
    try {
      const allUser = await queries.fetchAllUser();
      res.render("allUser", { allUser });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async joinMember(req, res) {
    if (!req.user) {
      console.log("Not log in");
      return res.redirect("/log-in");
    }

    try {
      const { code } = req.body;
      if (code === process.env.SECRET_CODE) {
        await queries.updateMembershipStatus(req.user.id);
        console.log("You are now a member");
      } else if (code === process.env.IS_ADMIN_CODE) {
        await queries.updateAdminStatus(req.user.id);
        console.log("You are now an admin");
      } else {
        console.log("You are not a member");
      }
      res.redirect("/");
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async renderHome(req, res) {
    // if not log in go back to "/"
    if (!req.isAuthenticated()) {
      return res.redirect("/log-in");
    }

    try {
      const allMessage = await queries.fetchAllMessage();
      res.render("home", { user: req.user, allMessage });
    } catch (error) {
      res.status(500).send;
    }
  },

  async renderUserById(req, res) {
    try {
      const { user, messages } = await queries.fetchUserandMessageById(
        req.params.id
      );
      res.render("profile", { user, messages });
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

module.exports = userController;
