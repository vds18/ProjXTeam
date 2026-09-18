import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    interests: "",
    teamSize: "",
    duration: "",
    experience: "Beginner",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,

            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill !== ""),

            interests: formData.interests
              .split(",")
              .map((interest) => interest.trim())
              .filter((interest) => interest !== ""),

            teamSize: Number(formData.teamSize),
            duration: formData.duration,
            experience: formData.experience,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Project created successfully! 🚀");
        navigate("/dashboard");
      } else {
        alert(data.message || "Failed to create project");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-page">

      <div className="create-project-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="create-project-header">

          <button
            className="create-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <span className="create-eyebrow">
            🚀 BUILD SOMETHING GREAT
          </span>

          <h1>
            Create a <span>Project</span>
          </h1>

          <p>
            Share your idea and find the right teammates
            to bring it to life.
          </p>

        </div>


        {/* =========================
            FORM CARD
        ========================= */}

        <div className="create-project-card">

          <form onSubmit={handleSubmit}>

            {/* PROJECT BASICS */}

            <div className="create-section">

              <div className="create-section-heading">
                <div className="create-section-icon">
                  💡
                </div>

                <div>
                  <h2>Project Basics</h2>
                  <p>
                    Tell people what you're building.
                  </p>
                </div>
              </div>


              {/* TITLE */}

              <div className="create-form-group">

                <label>
                  Project Title
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. AI Study Assistant"
                  required
                />

                <small>
                  Give your project a clear and memorable name.
                </small>

              </div>


              {/* DESCRIPTION */}

              <div className="create-form-group">

                <label>
                  Project Description
                  <span>*</span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your idea, what you want to build, and what teammates will work on..."
                  required
                  rows="6"
                />

                <small>
                  Explain your idea clearly so potential
                  teammates understand it.
                </small>

              </div>

            </div>


            {/* SKILLS & INTERESTS */}

            <div className="create-section">

              <div className="create-section-heading">
                <div className="create-section-icon">
                  🧩
                </div>

                <div>
                  <h2>Skills & Interests</h2>
                  <p>
                    Define what your project needs.
                  </p>
                </div>
              </div>


              {/* SKILLS */}

              <div className="create-form-group">

                <label>
                  Required Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB, Python"
                />

                <small>
                  Separate multiple skills with commas.
                </small>

              </div>


              {/* INTERESTS */}

              <div className="create-form-group">

                <label>
                  Project Interests 💡
                </label>

                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="AI, Web Development, Hackathons"
                />

                <small>
                  Add topics or areas your project focuses on.
                </small>

              </div>

            </div>


            {/* TEAM DETAILS */}

            <div className="create-section">

              <div className="create-section-heading">
                <div className="create-section-icon">
                  👥
                </div>

                <div>
                  <h2>Team Details</h2>
                  <p>
                    Tell potential teammates what you're looking for.
                  </p>
                </div>
              </div>


              <div className="create-two-column">

                {/* TEAM SIZE */}

                <div className="create-form-group">

                  <label>
                    Team Size
                    <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                    placeholder="4"
                    min="1"
                    required
                  />

                  <small>
                    Maximum number of team members.
                  </small>

                </div>


                {/* DURATION */}

                <div className="create-form-group">

                  <label>
                    Duration
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 2 months"
                  />

                  <small>
                    Expected project timeline.
                  </small>

                </div>

              </div>


              {/* EXPERIENCE */}

              <div className="create-form-group">

                <label>
                  Preferred Experience Level
                </label>

                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <option value="Beginner">
                    Beginner
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="Advanced">
                    Advanced
                  </option>
                </select>

                <small>
                  This helps ProjXTeam find compatible teammates.
                </small>

              </div>

            </div>


            {/* SMART MATCHING */}

            <div className="create-smart-box">

              <div className="create-smart-icon">
                🧠
              </div>

              <div>
                <strong>
                  Smart Team Matching
                </strong>

                <p>
                  ProjXTeam will analyze your project's
                  skills, interests and experience requirements
                  to help find suitable teammates.
                </p>
              </div>

            </div>


            {/* BUTTONS */}

            <div className="create-actions">

              <button
                type="button"
                className="create-cancel-btn"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="create-spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    🚀 Create Project
                  </>
                )}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default CreateProject;