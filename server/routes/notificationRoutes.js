const express = require("express");
const Notification = require("../models/Notifications");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET MY NOTIFICATIONS
// GET /api/notifications
// ==========================================
router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const notifications =
        await Notification.find({
          user: req.userId,
        })
          .populate("project", "title")
          .sort({ createdAt: -1 });

      res.json(notifications);

    } catch (error) {
      console.error(
        "Get notifications error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ==========================================
// GET UNREAD COUNT
// GET /api/notifications/unread-count
// ==========================================
router.get(
  "/unread-count",
  authMiddleware,
  async (req, res) => {
    try {
      const count =
        await Notification.countDocuments({
          user: req.userId,
          isRead: false,
        });

      res.json({
        count,
      });

    } catch (error) {
      console.error(
        "Get unread count error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ==========================================
// MARK ONE NOTIFICATION AS READ
// PUT /api/notifications/:id/read
// ==========================================
router.put(
  "/:id/read",
  authMiddleware,
  async (req, res) => {
    try {
      const notification =
        await Notification.findOne({
          _id: req.params.id,
          user: req.userId,
        });

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      notification.isRead = true;

      await notification.save();

      res.json({
        message:
          "Notification marked as read",
        notification,
      });

    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// PUT /api/notifications/read-all
// ==========================================
router.put(
  "/read-all",
  authMiddleware,
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          user: req.userId,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
          },
        }
      );

      res.json({
        message:
          "All notifications marked as read",
      });

    } catch (error) {
      console.error(
        "Mark all notifications read error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


module.exports = router;