const queries = require("../db/queries");

const messageController = {
  async newMessage(req, res) {
    if (!req.user) {
      return res.redirect("/log-in");
    }

    try {
      const { headline, description } = req.body;
      const { id } = req.user;

      await queries.createMessage(headline, description, id);

      res.redirect("/home");
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async deleteMessage(req, res) {
    if (!req.user) {
      return res.redirect("/log-in");
    }

    try {
      const { headline } = req.params;
      const { id } = req.user;

      // // Verify user owns this message or is admin
      // const message = await queries.getMessageByHeadline(headline);
      // if (message.userId != id && !req.user.isadmin) {
      //   return res.status(403).send("Unauthorized");
      // }

      await queries.deleteMessage(headline);
      res.redirect("/home");
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).send(error);
    }
  },

  async getMessages(req, res) {
    try {
      if (!req.user) {
        return res.redirect("/log-in");
      }

      const page = parseInt(req.params.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      // Get total count of messages
      const totalMessages = await queries.getTotalMessageCount();
      const totalPages = Math.ceil(totalMessages / limit);

      // Get paginated messages
      const messages = await queries.getMessagesPaginated(limit, offset);
      res.render("home", {
        user: req.user,
        allMessage: messages,
        currentPage: page,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      });
    } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).send("Error retrieving messages");
    }
  },

  async editMessage(req, res) {
    if (!req.user) {
      return res.redirect("/log-in");
    }

    try {
      const { userId, headline, description } = req.body;

      // Verify user owns this message or is admin
      if (userId != req.user.id && !req.user.isadmin) {
        return res.status(403).send("Unauthorized");
      }

      await queries.updateMessage(userId, headline, description);
      res.redirect("/home");
    } catch (error) {
      console.error("Error updating message:", error);
      res.status(500).send(error);
    }
  },
};

module.exports = messageController;
