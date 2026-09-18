const express = require("express");
const Message = require("../models/Message");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET PROJECT MESSAGES
// GET /api/messages/:projectId
// ==========================================
router.get(
  "/:projectId",
  authMiddleware,
  async (req, res) => {
    try {
      // Find project
      const project = await Project.findById(
        req.params.projectId
      );

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      // Check if user is a member
      const isMember = project.members.some(
        (member) =>
          member.toString() === req.userId
      );

      // Creator is also allowed
      const isCreator =
        project.creator.toString() ===
        req.userId;

      if (!isMember && !isCreator) {
        return res.status(403).json({
          message:
            "Only project team members can access this chat",
        });
      }

      const messages = await Message.find({
        project: req.params.projectId,
      })
        .populate(
          "sender",
          "name email profileImage"
        )
        .sort({ createdAt: 1 });

      res.json(messages);

    } catch (error) {
      console.error(
        "Get messages error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ==========================================
// SEND MESSAGE
// POST /api/messages/:projectId
// ==========================================
router.post(
  "/:projectId",
  authMiddleware,
  async (req, res) => {
    try {
      const { message } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({
          message: "Message cannot be empty",
        });
      }

      // Find project
      const project = await Project.findById(
        req.params.projectId
      );

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      // Check membership
      const isMember = project.members.some(
        (member) =>
          member.toString() === req.userId
      );

      // Creator is also allowed
      const isCreator =
        project.creator.toString() ===
        req.userId;

      if (!isMember && !isCreator) {
        return res.status(403).json({
          message:
            "Only project team members can send messages",
        });
      }

      // Create message
      const newMessage = await Message.create({
        project: project._id,
        sender: req.userId,
        message: message.trim(),
      });

      // Populate sender information
      const populatedMessage =
        await Message.findById(
          newMessage._id
        ).populate(
          "sender",
          "name email profileImage"
        );

      res.status(201).json({
        message: "Message sent successfully",
        data: populatedMessage,
      });

    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


module.exports = router;