import { API_URL } from "../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ==========================================
  // FETCH PROJECTS
  // ==========================================

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/projects`
      );

      const data = await response.json();

      if (response.ok) {
        setProjects(data);
      } else {
        alert(
          data.message ||
            "Failed to load projects"
        );
      }
    } catch (error) {
      console.error(error);
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UNIQUE SKILLS
  // ==========================================

  const allSkills = [
    "All",
    ...new Set(
      projects.flatMap(
        (project) => project.skills || []
      )
    ),
  ];

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredProjects = projects.filter(
    (project) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const title =
        project.title?.toLowerCase() || "";

      const description =
        project.description?.toLowerCase() || "";

      const skills =
        project.skills
          ?.join(" ")
          .toLowerCase() || "";

      const interests =
        project.interests
          ?.join(" ")
          .toLowerCase() || "";

      const creator =
        project.creator?.name
          ?.toLowerCase() || "";

      const searchableText = `
        ${title}
        ${description}
        ${skills}
        ${interests}
        ${creator}
      `;

      const matchesSearch =
        searchableText.includes(searchText);

      const matchesSkill =
        skillFilter === "All" ||
        project.skills?.some(
          (skill) =>
            skill.toLowerCase().trim() ===
            skillFilter.toLowerCase().trim()
        );

      return matchesSearch && matchesSkill;
    }
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="projects-page loading-page">
        <div className="loading-box">
          <div className="loading-spinner"></div>

          <h2>Loading Projects...</h2>

          <p>
            Finding projects you can build with.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // SEND JOIN REQUEST
  // ==========================================

  const handleJoin = async (e, project) => {
    e.stopPropagation();

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/join-requests/${project._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchProjects();
      } else {
        alert(
          data.message ||
            "Unable to send join request"
        );
      }
    } catch (error) {
      console.error(error);
      alert("Server connection failed");
    }
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setSkillFilter("All");
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="projects-page">
      <div className="projects-container">

        {/* HEADER */}

        <div className="projects-header">

          <div>
            <div className="projects-badge">
              🔎 Discover & Collaborate
            </div>

            <h1>
              Explore Projects
            </h1>

            <p>
              Find exciting projects and connect
              with talented teammates.
            </p>
          </div>

          <button
            type="button"
            className="create-project-btn"
            onClick={() =>
              navigate("/create-project")
            }
          >
            + Create Project
          </button>

        </div>


        {/* SEARCH + FILTER */}

        <div className="projects-filter-card">

          <div className="projects-search-wrapper">

            <span className="projects-search-icon">
              🔎
            </span>

            <input
              type="text"
              placeholder="Search by project, skill, interest or creator..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="projects-search-input"
            />

            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() =>
                  setSearch("")
                }
              >
                ✕
              </button>
            )}

          </div>


          <select
            value={skillFilter}
            onChange={(e) =>
              setSkillFilter(e.target.value)
            }
            className="skill-filter-select"
          >
            {allSkills.map((skill) => (
              <option
                key={skill}
                value={skill}
              >
                {skill === "All"
                  ? "All Skills"
                  : skill}
              </option>
            ))}
          </select>

        </div>


        {/* RESULTS */}

        <div className="projects-results-row">

          <span>
            Showing{" "}
            <strong>
              {filteredProjects.length}
            </strong>{" "}
            project
            {filteredProjects.length !== 1
              ? "s"
              : ""}
          </span>

          {(search ||
            skillFilter !== "All") && (
            <button
              type="button"
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}

        </div>


        {/* EMPTY STATE */}

        {filteredProjects.length === 0 ? (

          <div className="projects-empty-state">

            <div className="projects-empty-icon">
              🔍
            </div>

            <h2>
              No projects found
            </h2>

            <p>
              Try another project name, skill,
              interest, or creator.
            </p>

            <button
              type="button"
              className="primary-btn"
              onClick={clearFilters}
            >
              Reset Filters
            </button>

          </div>

        ) : (

          /* PROJECT GRID */

          <div className="projects-grid">

            {filteredProjects.map(
              (project) => {

                const memberCount =
                  project.members?.length || 0;

                const teamSize =
                  project.teamSize || 1;

                const isFull =
                  memberCount >= teamSize;

                const progress = Math.min(
                  (memberCount / teamSize) * 100,
                  100
                );

                return (
                  <div
                    key={project._id}
                    className="explore-project-card"
                    onClick={() =>
                      navigate(
                        `/projects/${project._id}`
                      )
                    }
                  >

                    {/* CARD TOP */}

                    <div className="explore-card-top">

                      <div className="explore-project-icon">
                        🚀
                      </div>

                      <span
                        className={
                          isFull
                            ? "explore-status full"
                            : "explore-status recruiting"
                        }
                      >
                        {isFull
                          ? "Team Full"
                          : "Recruiting"}
                      </span>

                    </div>


                    {/* TITLE */}

                    <h2 className="explore-project-title">
                      {project.title}
                    </h2>


                    {/* DESCRIPTION */}

                    <p className="explore-project-description">
                      {project.description}
                    </p>


                    {/* SKILLS */}

                    {project.skills?.length > 0 && (
                      <div className="explore-skills">

                        {project.skills
                          .slice(0, 4)
                          .map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="explore-skill-tag"
                              >
                                {skill}
                              </span>
                            )
                          )}

                        {project.skills.length >
                          4 && (
                          <span className="explore-more-tag">
                            +
                            {project.skills.length -
                              4}
                          </span>
                        )}

                      </div>
                    )}


                    {/* INTERESTS */}

                    {project.interests?.length >
                      0 && (
                      <div className="explore-interest">
                        💡{" "}
                        {project.interests
                          .slice(0, 2)
                          .join(" · ")}
                      </div>
                    )}


                    {/* TEAM PROGRESS */}

                    <div className="explore-team-section">

                      <div className="explore-team-header">

                        <span>
                          👥 Team
                        </span>

                        <strong>
                          {memberCount}/
                          {teamSize}
                        </strong>

                      </div>

                      <div className="explore-progress-bg">

                        <div
                          className="explore-progress-bar"
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                    </div>


                    {/* META */}

                    <div className="explore-meta">

                      <span>
                        ⏳{" "}
                        {project.duration ||
                          "Flexible"}
                      </span>

                      <span>
                        🎯{" "}
                        {project.experience ||
                          "Beginner"}
                      </span>

                    </div>


                    {/* CREATOR */}

                    <div className="explore-creator">

                      <div className="explore-creator-avatar">
                        {project.creator?.name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "U"}
                      </div>

                      <div>

                        <span className="explore-creator-label">
                          Created by
                        </span>

                        <strong className="explore-creator-name">
                          {project.creator?.name ||
                            "Unknown"}
                        </strong>

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="explore-action-row">

                      <button
                        type="button"
                        className="explore-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();

                          navigate(
                            `/projects/${project._id}`
                          );
                        }}
                      >
                        View Details
                      </button>


                      <button
                        type="button"
                        className={
                          isFull
                            ? "explore-join-btn full"
                            : "explore-join-btn"
                        }
                        onClick={(e) =>
                          handleJoin(
                            e,
                            project
                          )
                        }
                        disabled={isFull}
                      >
                        {isFull
                          ? "🔒 Full"
                          : "🤝 Join"}
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default Projects;