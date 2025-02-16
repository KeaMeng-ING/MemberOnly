const queries = require("../db/queries");

const messageController = {
  async newMessage(req, res) {
    if (!req.user) {
      console.log("Not log in");
      return res.redirect("/log-in");
    }

    try {
      const { headline, description } = req.body;
      const { id } = req.user;

      await queries.createMessage(headline, description, id);

      console.log("Message created");
      res.redirect("/home");
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

module.exports = messageController;
