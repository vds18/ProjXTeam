import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyProjects() {
  const navigate = useNavigate();

  const [createdProjects, setCreatedProjects] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/projects/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCreatedProjects(data.createdProjects || []);
        setJoinedProjects(data.joinedProjects || []);
      } else {
        alert(data.message || "Failed to load projects");
      }
    } catch (error) {
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const ProjectCard = ({ project }) => {
    const members = project.members?.length || 0;
    const isFull = members >= project.teamSize;

    return (
      <div
        className="project-card"
        onClick={() => navigate(`/projects/${project._id}`)}
      >
        {/* HEADER */}
        <div className="project-card-header">
          <h3>{project.title}</h3>

          <span
            className={
              isFull
                ? "project-status full"
                : "project-status open"
            }
          >
            {isFull ? "FULL" : "OPEN"}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="project-description">
          {project.description}
        </p>

        {/* PROJECT INFO */}
        <div className="project-info">
          <span>
            👥 {members}/{project.teamSize}
          </span>

          <span>
            ⏳ {project.duration || "Flexible"}
          </span>

          <span>
            🎯 {project.experience || "Beginner"}
          </span>
        </div>

        {/* SKILLS */}
        {project.skills?.length > 0 && (
          <div className="project-skills">
            {project.skills.map((skill, index) => (
              <span key={index}>{skill}</span>
            ))}
          </div>
        )}

        {/* VIEW PROJECT */}
        <div className="view-project">
          View Project →
        </div>
      </div>
    );
  };

  /* LOADING STATE */
  if (loading) {
    return (
      <div className="my-projects-page loading-page">
        <div className="loading-box">
          <div className="loading-spinner"></div>

          <h2>Loading your projects...</h2>

          <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-projects-page">
      <div className="my-projects-container">

        {/* PAGE HEADER */}
        <div className="my-projects-header">
          <h1>My Projects 📁</h1>

          <p>
            Manage the projects you've created and joined.
          </p>
        </div>

        {/* CREATED PROJECTS */}
        <section className="projects-section">
          <div className="section-header">
            <h2>👑 Projects I Created</h2>

            {createdProjects.length > 0 && (
              <span className="project-count">
                {createdProjects.length} Project
                {createdProjects.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {createdProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>

              <h3>No projects created yet</h3>

              <p>
                Start your own project and find the perfect
                teammates.
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  navigate("/create-project")
                }
              >
                🚀 Create Project
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {createdProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                />
              ))}
            </div>
          )}
        </section>

        {/* JOINED PROJECTS */}
        <section className="projects-section">
          <div className="section-header">
            <h2>👥 Projects I Joined</h2>

            {joinedProjects.length > 0 && (
              <span className="project-count joined-count">
                {joinedProjects.length} Project
                {joinedProjects.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {joinedProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔎</div>

              <h3>No joined projects yet</h3>

              <p>
                Explore projects and join a team that matches
                your skills.
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  navigate("/projects")
                }
              >
                🔎 Explore Projects
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {joinedProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default MyProjects;