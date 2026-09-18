const express = require("express");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();


// ==========================================
// CREATE PROJECT
// POST /api/projects
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      skills,
      interests,
      teamSize,
      duration,
      experience,
    } = req.body;

    // Validate required fields
    if (!title || !description || !teamSize) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Validate team size
    const parsedTeamSize = Number(teamSize);

    if (
      !Number.isInteger(parsedTeamSize) ||
      parsedTeamSize < 1
    ) {
      return res.status(400).json({
        message: "Team size must be a positive integer",
      });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      skills: skills || [],
      interests: interests || [],
      teamSize: parsedTeamSize,
      duration: duration || "",
      experience: experience || "Beginner",
      creator: req.userId,
      members: [req.userId],
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });

  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ==========================================
// GET ALL PROJECTS
// GET /api/projects
// ==========================================
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("creator", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);

  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ==========================================
// JOIN PROJECT TEAM
// POST /api/projects/:id/join
// ==========================================
router.post(
  "/:id/join",
  authMiddleware,
  validateObjectId, 
async (req, res) => {
    try {
      const project = await Project.findById(
        req.params.id
      );

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      // Check if user is already a member
      const alreadyMember =
        project.members.some(
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

      // Add user to team
      project.members.push(req.userId);

      await project.save();

      res.json({
        message:
          "You joined the project successfully! 🚀",
        project,
      });

    } catch (error) {
      console.error("Join project error:", error);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ==========================================
// GET MY PROJECTS
// GET /api/projects/my
// ==========================================
router.get(
  "/my",
  authMiddleware,
  async (req, res) => {
    try {
      const projects = await Project.find({
        members: req.userId,
      })
        .populate("creator", "name email")
        .populate("members", "name email")
        .sort({ createdAt: -1 });

      const createdProjects =
        projects.filter(
          (project) =>
            project.creator?._id.toString() ===
            req.userId
        );

      const joinedProjects =
        projects.filter(
          (project) =>
            project.creator?._id.toString() !==
            req.userId
        );

      res.json({
        createdProjects,
        joinedProjects,
      });

    } catch (error) {
      console.error(
        "Get my projects error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ==========================================
// UPDATE PROJECT
// PUT /api/projects/:id
// ==========================================
router.put(
  "/:id",
  authMiddleware,
  validateObjectId,
  async (req, res) => {
    try {
      const project = await Project.findById(
        req.params.id
      );

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      // Only creator can edit
      if (
        project.creator.toString() !==
        req.userId
      ) {
        return res.status(403).json({
          message:
            "Only the project creator can edit this project",
        });
      }

      const {
        title,
        description,
        skills,
        interests,
        teamSize,
        duration,
        experience,
      } = req.body;

      // Validate required fields
      if (!title || !description || !teamSize) {
        return res.status(400).json({
          message: "Please fill all required fields",
        });
      }

      // Validate team size
      const parsedTeamSize = Number(teamSize);

      if (
        !Number.isInteger(parsedTeamSize) ||
        parsedTeamSize < 1
      ) {
        return res.status(400).json({
          message:
            "Team size must be a positive integer",
        });
      }

      // Team size cannot be smaller
      // than current members
      if (
        parsedTeamSize <
        project.members.length
      ) {
        return res.status(400).json({
          message:
            "Team size cannot be smaller than current members",
        });
      }

      project.title = title.trim();
      project.description = description.trim();
      project.skills = skills || [];
      project.interests = interests || [];
      project.teamSize = parsedTeamSize;
      project.duration = duration || "";
      project.experience =
        experience || "Beginner";

      await project.save();

      const updatedProject =
        await Project.findById(project._id)
          .populate(
            "creator",
            "name email"
          )
          .populate(
            "members",
            "name email"
          );

      res.json({
        message:
          "Project updated successfully! ✅",
        project: updatedProject,
      });

    } catch (error) {
      console.error(
        "Update project error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ==========================================
// DELETE PROJECT
// DELETE /api/projects/:id
// ==========================================
  router.delete(
  "/:id",
  authMiddleware,
  validateObjectId,
async (req, res) => {
    try {
      const project = await Project.findById(
        req.params.id
      );

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      // Only creator can delete
      if (
        project.creator.toString() !==
        req.userId
      ) {
        return res.status(403).json({
          message:
            "Only the project creator can delete this project",
        });
      }

      await Project.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Project deleted successfully! 🗑️",
      });

    } catch (error) {
      console.error(
        "Delete project error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ==========================================
// GET SINGLE PROJECT
// GET /api/projects/:id
// ==========================================
  router.get(
  "/:id",
  validateObjectId,
  async (req, res) => {
try {
    const project = await Project.findById(
      req.params.id
    )
      .populate(
        "creator",
        "name email"
      )
      .populate(
        "members",
        "name email skills experience bio"
      );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);

  } catch (error) {
    console.error(
      "Get single project error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
});


module.exports = router;