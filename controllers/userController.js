// controllers/userController.js

const queries = require("../db/queries");
const bcrypt = require("bcryptjs");

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

  async renderUser(req, res) {
    try {
      const allUser = await queries.fetchAllUser();
      res.render("allUser", { allUser });
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

module.exports = userController;
