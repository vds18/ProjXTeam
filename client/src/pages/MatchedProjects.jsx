import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MatchedProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchedProjects();
  }, []);

  const fetchMatchedProjects = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/matching/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProjects(data);
      } else {
        alert(data.message || "Failed to load matched projects");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="matched-page">
        <div className="matched-loading">
          <div className="matched-loading-icon">🧠</div>

          <h2>Finding Your Best Matches...</h2>

          <p>
            Analyzing your skills, experience
            <br />
            and interests.
          </p>

          <div className="matched-loading-bar">
            <div className="matched-loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="matched-page">
      <div className="matched-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="matched-header">
          <div>
            <span className="matched-eyebrow">
              ✨ AI-POWERED DISCOVERY
            </span>

            <h1>
              Projects <span>Made For You</span>
            </h1>

            <p>
              Discover projects that align with your skills,
              experience and interests.
            </p>
          </div>

          <button
            className="matched-explore-btn"
            onClick={() => navigate("/projects")}
          >
            🔎 Explore All Projects
          </button>
        </div>

        {/* =========================
            INFO BANNER
        ========================= */}

        {projects.length > 0 && (
          <div className="matched-info-banner">

            <div className="matched-info-icon">
              ✨
            </div>

            <div className="matched-info-content">
              <strong>Personalized for you</strong>

              <p>
                Matches are calculated using your
                skills, experience level and interests.
              </p>
            </div>

            <div className="matched-count">
              <strong>{projects.length}</strong>
              <span>Matches</span>
            </div>

          </div>
        )}

        {/* =========================
            EMPTY STATE
        ========================= */}

        {projects.length === 0 ? (
          <div className="matched-empty">

            <div className="matched-empty-icon">
              🔍
            </div>

            <h2>No projects found</h2>

            <p>
              There are currently no projects that
              match your profile.
            </p>

            <div className="matched-empty-actions">

              <button
                className="matched-primary-btn"
                onClick={() => navigate("/projects")}
              >
                🔎 Explore Projects
              </button>

              <button
                className="matched-secondary-btn"
                onClick={() => navigate("/create-project")}
              >
                🚀 Create a Project
              </button>

            </div>
          </div>
        ) : (

          /* =========================
             PROJECT GRID
          ========================= */

          <div className="matched-grid">

            {projects.map((project) => {

              const overallMatch =
                project.overallMatch || 0;

              const skillMatch =
                project.skillMatch || 0;

              const experienceMatch =
                project.experienceMatch || 0;

              const interestMatch =
                project.interestMatch || 0;

              const memberCount =
                project.members?.length || 0;

              const teamSize =
                project.teamSize || 1;

              const isFull =
                memberCount >= teamSize;

              return (
                <div
                  key={project._id}
                  className="matched-card"
                >

                  {/* CARD TOP */}

                  <div className="matched-card-top">

                    <div className="matched-project-heading">

                      <div className="matched-project-icon">
                        🚀
                      </div>

                      <div>
                        <span className="matched-project-label">
                          PROJECT MATCH
                        </span>

                        <h2>
                          {project.title}
                        </h2>
                      </div>

                    </div>

                    {/* MATCH SCORE */}

                    <div
                      className="matched-score"
                      style={{
                        "--match": `${overallMatch}%`,
                      }}
                    >
                      <div className="matched-score-inner">
                        <strong>{overallMatch}%</strong>
                        <span>match</span>
                      </div>
                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <p className="matched-description">
                    {project.description}
                  </p>

                  {/* MATCH BREAKDOWN */}

                  <div className="matched-breakdown">

                    <div className="matched-breakdown-header">
                      <h3>📊 Match Breakdown</h3>
                      <span>Your profile</span>
                    </div>

                    {/* SKILLS */}

                    <div className="matched-progress-row">

                      <div className="matched-progress-label">
                        <span>🛠️ Skills</span>
                        <strong>{skillMatch}%</strong>
                      </div>

                      <div className="matched-progress-track">
                        <div
                          className="matched-progress-fill"
                          style={{
                            width: `${skillMatch}%`,
                          }}
                        />
                      </div>

                    </div>

                    {/* EXPERIENCE */}

                    <div className="matched-progress-row">

                      <div className="matched-progress-label">
                        <span>🎯 Experience</span>
                        <strong>{experienceMatch}%</strong>
                      </div>

                      <div className="matched-progress-track">
                        <div
                          className="matched-progress-fill"
                          style={{
                            width: `${experienceMatch}%`,
                          }}
                        />
                      </div>

                    </div>

                    {/* INTERESTS */}

                    <div className="matched-progress-row last">

                      <div className="matched-progress-label">
                        <span>💡 Interests</span>
                        <strong>{interestMatch}%</strong>
                      </div>

                      <div className="matched-progress-track">
                        <div
                          className="matched-progress-fill"
                          style={{
                            width: `${interestMatch}%`,
                          }}
                        />
                      </div>

                    </div>

                  </div>

                  {/* MATCHED SKILLS */}

                  {project.matchedSkills?.length > 0 && (
                    <div className="matched-tags-section">

                      <h3>✅ Your Matching Skills</h3>

                      <div className="matched-tags">
                        {project.matchedSkills.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="matched-skill-tag"
                            >
                              ✓ {skill}
                            </span>
                          )
                        )}
                      </div>

                    </div>
                  )}

                  {/* MATCHED INTERESTS */}

                  {project.matchedInterests?.length > 0 && (
                    <div className="matched-tags-section">

                      <h3>💜 Matching Interests</h3>

                      <div className="matched-tags">
                        {project.matchedInterests.map(
                          (interest, index) => (
                            <span
                              key={index}
                              className="matched-interest-tag"
                            >
                              ♥ {interest}
                            </span>
                          )
                        )}
                      </div>

                    </div>
                  )}

                  {/* PROJECT INFO */}

                  <div className="matched-project-info">

                    <div>
                      <span>👥</span>
                      <small>Team</small>
                      <strong>
                        {memberCount}/{teamSize}
                      </strong>
                    </div>

                    <div>
                      <span>⏳</span>
                      <small>Duration</small>
                      <strong>
                        {project.duration || "Flexible"}
                      </strong>
                    </div>

                    <div>
                      <span>🎓</span>
                      <small>Level</small>
                      <strong>
                        {project.experience || "Beginner"}
                      </strong>
                    </div>

                  </div>

                  {/* TEAM STATUS */}

                  <div
                    className={`matched-team-status ${
                      isFull ? "full" : "open"
                    }`}
                  >
                    <span>
                      {isFull
                        ? "🔒 Team is full"
                        : "🟢 Recruiting teammates"}
                    </span>

                    <strong>
                      {memberCount}/{teamSize}
                    </strong>
                  </div>

                  {/* CREATOR */}

                  {project.creator && (
                    <div className="matched-creator">

                      <div className="matched-avatar">
                        {project.creator.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>

                      <div>
                        <small>Created by</small>
                        <strong>
                          {project.creator.name}
                        </strong>
                      </div>

                    </div>
                  )}

                  {/* BUTTON */}

                  <button
                    className="matched-view-btn"
                    onClick={() =>
                      navigate(`/projects/${project._id}`)
                    }
                  >
                    View Project
                    <span>→</span>
                  </button>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default MatchedProjects;