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

      res.redirect("/");
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async renderLogin(req, res) {
    try {
      const error = req.query.error ? "Invalid username or password" : "";
      res.render("log-in", { error });
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

  // async joinMember(req, res) {
  //   if (!req.user) {
  //     return res.redirect("/log-in");
  //   }
  //   try {
  //     const { code } = req.body;
  //     console.log(code);
  //     if (code === process.env.SECRET_CODE) {
  //       if (req.user.memberstatus === "Member") {
  //         return res.status(400).json({ error: "User is already a member" });
  //       } else if (req.user.isAdmin) {
  //         return res.status(400).json({ error: "User is already an admin" });
  //       }
  //       await queries.updateMembershipStatus(req.user.id);
  //       return res.status(200).json({ message: "Membership updated" });
  //     } else if (code === process.env.IS_ADMIN_CODE) {
  //       await queries.updateAdminStatus(req.user.id);
  //       return res.status(200).json({ message: "Admin status updated" });
  //     } else {
  //       return res.status(400).json({ error: "Invalid code" });
  //     }
  //   } catch (error) {
  //     res.status(500).send(error);
  //   }
  // },

  async joinMember(req, res) {
    if (!req.user) {
      return res.redirect("/log-in");
    }
    try {
      const { code } = req.body;
      const error = "";
      if (code === process.env.SECRET_CODE) {
        if (req.user.memberstatus === "Member") {
          error = "User is already a member";
        } else if (req.user.isAdmin) {
          error = "User is already an admin";
        }
        await queries.updateMembershipStatus(req.user.id);
      } else if (code === process.env.IS_ADMIN_CODE) {
        await queries.updateAdminStatus(req.user.id);
      } else {
        error = "Invalid code";
      }
      res.status(400).json({ error });
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
