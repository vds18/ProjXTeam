const express = require("express");
const Project = require("../models/Project");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET MATCHED PROJECTS
// GET /api/matching/projects
// ==========================================
router.get(
  "/projects",
  authMiddleware,
  async (req, res) => {
    try {

      // ==========================================
      // FIND CURRENT USER
      // ==========================================

      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }


      // ==========================================
      // GET ALL PROJECTS
      // ==========================================

      const projects = await Project.find()
        .populate(
          "creator",
          "name email skills"
        )
        .populate(
          "members",
          "name email skills"
        );


      // ==========================================
      // USER SKILLS
      // ==========================================

      const userSkills = (user.skills || []).map(
        (skill) =>
          skill.toLowerCase().trim()
      );


      // ==========================================
      // USER INTERESTS
      // ==========================================

      const userInterests =
        (user.interests || []).map(
          (interest) =>
            interest.toLowerCase().trim()
        );


      // ==========================================
      // EXPERIENCE LEVELS
      // ==========================================

      const experienceLevels = {
        Beginner: 1,
        Intermediate: 2,
        Advanced: 3,
      };


      // ==========================================
      // CALCULATE MATCHING
      // ==========================================

      const matchedProjects = projects.map(
        (project) => {

          // ======================================
          // SKILL MATCH
          // ======================================

          const projectSkills =
            (project.skills || []).map(
              (skill) =>
                skill.toLowerCase().trim()
            );

          let skillMatch = 0;
          let matchedSkills = [];

          if (projectSkills.length > 0) {

            matchedSkills =
              projectSkills.filter(
                (skill) =>
                  userSkills.includes(skill)
              );

            skillMatch =
              (matchedSkills.length /
                projectSkills.length) *
              100;
          }


          // ======================================
          // EXPERIENCE MATCH
          // ======================================

          const userExperience =
            experienceLevels[
              user.experience
            ] || 1;

          const projectExperience =
            experienceLevels[
              project.experience
            ] || 1;

          const experienceDifference =
            Math.abs(
              userExperience -
                projectExperience
            );

          let experienceMatch;

          if (experienceDifference === 0) {

            experienceMatch = 100;

          } else if (
            experienceDifference === 1
          ) {

            experienceMatch = 70;

          } else {

            experienceMatch = 40;
          }


          // ======================================
          // INTEREST MATCH
          // ======================================

          const projectInterests =
            (project.interests || []).map(
              (interest) =>
                interest.toLowerCase().trim()
            );

          let interestMatch = 0;
          let matchedInterests = [];

          if (projectInterests.length > 0) {

            matchedInterests =
              projectInterests.filter(
                (interest) =>
                  userInterests.includes(interest)
              );

            interestMatch =
              (matchedInterests.length /
                projectInterests.length) *
              100;
          }


          // ======================================
          // FINAL MATCH SCORE
          // ======================================

          const overallMatch =
            (skillMatch * 0.60) +
            (experienceMatch * 0.20) +
            (interestMatch * 0.20);


          // ======================================
          // RETURN PROJECT
          // ======================================

          return {
            ...project.toObject(),

            skillMatch:
              Math.round(skillMatch),

            experienceMatch:
              Math.round(experienceMatch),

            interestMatch:
              Math.round(interestMatch),

            overallMatch:
              Math.round(overallMatch),

            matchedSkills,

            matchedInterests,
          };
        }
      );


      // ==========================================
      // SORT BY OVERALL MATCH
      // ==========================================

      matchedProjects.sort(
        (a, b) =>
          b.overallMatch -
          a.overallMatch
      );


      // ==========================================
      // SEND RESPONSE
      // ==========================================

      res.json(matchedProjects);

    } catch (error) {

      console.error(
        "Matching projects error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


module.exports = router;