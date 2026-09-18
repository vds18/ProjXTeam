const express = require("express");
const JoinRequest = require("../models/JoinRequest");
const Project = require("../models/Project");
const Notification = require("../models/Notifications");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// SEND JOIN REQUEST
// POST /api/join-requests/:projectId
// ==========================================
router.post(
  "/:projectId",
  authMiddleware,
  async (req, res) => {
    try {
      const project = await Project.findById(
        req.params.projectId
      );

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      // Creator cannot request to join own project
      if (
        project.creator.toString() ===
        req.userId
      ) {
        return res.status(400).json({
          message:
            "You are already the creator of this project",
        });
      }

      // Check if already a member
      const alreadyMember = project.members.some(
        (member) =>
          member.toString() === req.userId
      );

      if (alreadyMember) {
        return res.status(400).json({
          message:
            "You are already a member of this project",
        });
      }

      // Check team capacity
      if (
        project.members.length >=
        project.teamSize
      ) {
        return res.status(400).json({
          message:
            "This project team is already full",
        });
      }

      // Check existing pending request
      const existingRequest =
        await JoinRequest.findOne({
          project: project._id,
          user: req.userId,
          status: "pending",
        });

      if (existingRequest) {
        return res.status(400).json({
          message:
            "You already have a pending request",
        });
      }

      // Create join request
      const request = await JoinRequest.create({
        project: project._id,
        user: req.userId,
        status: "pending",
      });

      // Create notification for project creator
      await Notification.create({
        user: project.creator,
        type: "join_request",
        message: `Someone requested to join your project "${project.title}"`,
        project: project._id,
        joinRequest: request._id,
      });

      res.status(201).json({
        message:
          "Join request sent successfully! 🚀",
        request,
      });

    } catch (error) {
      console.error(
        "Send join request error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ==========================================
// GET MY PROJECT REQUESTS
// Creator sees requests for their projects
// GET /api/join-requests/my
// ==========================================
router.get(
  "/my",
  authMiddleware,
  async (req, res) => {
    try {
      const projects = await Project.find({
        creator: req.userId,
      }).select("_id");

      const projectIds = projects.map(
        (project) => project._id
      );

      const requests = await JoinRequest.find({
        project: { $in: projectIds },
        status: "pending",
      })
        .populate(
          "user",
          "name email skills experience bio"
        )
        .populate(
          "project",
          "title teamSize members"
        )
        .sort({ createdAt: -1 });

      res.json(requests);

    } catch (error) {
      console.error(
        "Get join requests error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ==========================================
// ACCEPT JOIN REQUEST
// PUT /api/join-requests/:id/accept
// ==========================================
router.put(
  "/:id/accept",
  authMiddleware,
  async (req, res) => {
    try {
      const request =
        await JoinRequest.findById(
          req.params.id
        );

      if (!request) {
        return res.status(404).json({
          message: "Join request not found",
        });
      }

      if (request.status !== "pending") {
        return res.status(400).json({
          message:
            "This request has already been processed",
        });
      }

      const project = await Project.findById(
        request.project
      );

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      // Only creator can accept
      if (
        project.creator.toString() !==
        req.userId
      ) {
        return res.status(403).json({
          message:
            "Only the project creator can accept requests",
        });
      }

      // Check team capacity again
      if (
        project.members.length >=
        project.teamSize
      ) {
        return res.status(400).json({
          message:
            "The project team is already full",
        });
      }

      // Prevent duplicate membership
      const alreadyMember = project.members.some(
        (member) =>
          member.toString() ===
          request.user.toString()
      );

      if (!alreadyMember) {
        project.members.push(request.user);

        await project.save();
      }

      // Update request status
      request.status = "accepted";

      await request.save();

      // Notify requester
      await Notification.create({
        user: request.user,
        type: "request_accepted",
        message: `Your request to join "${project.title}" was accepted! 🎉`,
        project: project._id,
        joinRequest: request._id,
      });

      res.json({
        message:
          "Join request accepted! 🎉",
        request,
      });

    } catch (error) {
      console.error(
        "Accept join request error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ==========================================
// REJECT JOIN REQUEST
// PUT /api/join-requests/:id/reject
// ==========================================
router.put(
  "/:id/reject",
  authMiddleware,
  async (req, res) => {
    try {
      const request =
        await JoinRequest.findById(
          req.params.id
        );

      if (!request) {
        return res.status(404).json({
          message: "Join request not found",
        });
      }

      if (request.status !== "pending") {
        return res.status(400).json({
          message:
            "This request has already been processed",
        });
      }

      const project = await Project.findById(
        request.project
      );

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      // Only creator can reject
      if (
        project.creator.toString() !==
        req.userId
      ) {
        return res.status(403).json({
          message:
            "Only the project creator can reject requests",
        });
      }

      // Update request status
      request.status = "rejected";

      await request.save();

      // Notify requester
      await Notification.create({
        user: request.user,
        type: "request_rejected",
        message: `Your request to join "${project.title}" was rejected.`,
        project: project._id,
        joinRequest: request._id,
      });

      res.json({
        message:
          "Join request rejected.",
        request,
      });

    } catch (error) {
      console.error(
        "Reject join request error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


module.exports = router;