import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  useEffect(() => {
    fetchProjects();
    fetchProfile();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/projects"
      );

      const data = await response.json();

      if (response.ok) {
        setProjects(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const totalMembers = projects.reduce(
    (total, project) =>
      total + (project.members?.length || 0),
    0
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="dashboard-hero">

          <div className="dashboard-hero-content">

            <div className="dashboard-eyebrow">
              <span>✦</span>
              YOUR COLLABORATION SPACE
            </div>

            <h1>
              Welcome back,
              <br />
              <span>{user?.name || "Developer"}</span> 👋
            </h1>

            <p>
              Turn ideas into reality by finding the
              right people to build with.
            </p>

            <div className="dashboard-hero-actions">

              <button
                className="dashboard-primary-btn"
                onClick={() => navigate("/create-project")}
              >
                🚀 Create Project
              </button>

              <button
                className="dashboard-secondary-btn"
                onClick={() => navigate("/projects")}
              >
                🔎 Explore Projects
              </button>

            </div>

          </div>


          {/* HERO VISUAL */}

          <div className="dashboard-hero-visual">

            <div className="hero-orbit orbit-one"></div>
            <div className="hero-orbit orbit-two"></div>

            <div className="hero-center-icon">
              🚀
            </div>

            <div className="floating-icon floating-one">
              💻
            </div>

            <div className="floating-icon floating-two">
              🧠
            </div>

            <div className="floating-icon floating-three">
              👥
            </div>

          </div>

        </section>


        {/* =================================================
            STATS
        ================================================= */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="stat-icon purple">
              📁
            </div>

            <div>
              <span className="stat-label">
                Projects Available
              </span>

              <strong>
                {projects.length}
              </strong>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon blue">
              💡
            </div>

            <div>
              <span className="stat-label">
                Your Skills
              </span>

              <strong>
                {user?.skills?.length || 0}
              </strong>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon green">
              👥
            </div>

            <div>
              <span className="stat-label">
                Active Members
              </span>

              <strong>
                {totalMembers}
              </strong>
            </div>

          </div>

        </section>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="dashboard-section-heading">

          <div>
            <span className="section-eyebrow">
              GET STARTED
            </span>

            <h2>
              What do you want to do?
            </h2>

            <p>
              Jump into your next collaboration.
            </p>
          </div>

        </div>


        <section className="dashboard-actions">

          {/* CREATE */}

          <div
            className="dashboard-action-card create-card"
            onClick={() =>
              navigate("/create-project")
            }
          >

            <div className="action-card-top">

              <div className="action-icon">
                🚀
              </div>

              <span className="action-arrow">
                ↗
              </span>

            </div>

            <h3>
              Create a Project
            </h3>

            <p>
              Have an idea? Turn it into a project
              and build your dream team.
            </p>

            <span className="action-link">
              Start building →
            </span>

          </div>


          {/* EXPLORE */}

          <div
            className="dashboard-action-card"
            onClick={() =>
              navigate("/projects")
            }
          >

            <div className="action-card-top">

              <div className="action-icon">
                🔎
              </div>

              <span className="action-arrow">
                ↗
              </span>

            </div>

            <h3>
              Explore Projects
            </h3>

            <p>
              Discover interesting projects and
              connect with talented contributors.
            </p>

            <span className="action-link">
              Find projects →
            </span>

          </div>


          {/* MATCH */}

          <div
            className="dashboard-action-card"
            onClick={() =>
              navigate("/matched-projects")
            }
          >

            <div className="action-card-top">

              <div className="action-icon">
                🧠
              </div>

              <span className="action-arrow">
                ↗
              </span>

            </div>

            <h3>
              Projects For You
            </h3>

            <p>
              Get personalized project matches based
              on your skills and interests.
            </p>

            <span className="action-link">
              See your matches →
            </span>

          </div>

        </section>


        {/* =================================================
            PROFILE
        ================================================= */}

        <section className="dashboard-profile-card">

          <div className="profile-card-left">

            <div className="dashboard-profile-avatar">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>

              <span className="profile-small-label">
                YOUR PROFILE
              </span>

              <h2>
                {user?.name || "Developer"}
              </h2>

              <p>
                {user?.bio ||
                  "Add a bio to tell teammates about yourself."}
              </p>

            </div>

          </div>


          <div className="dashboard-profile-right">

            <div className="profile-experience">
              <span>EXPERIENCE</span>

              <strong>
                {user?.experience || "Beginner"}
              </strong>
            </div>

            <button
              className="profile-edit-btn"
              onClick={() =>
                navigate("/profile")
              }
            >
              Edit Profile →
            </button>

          </div>


          <div className="dashboard-skills">

            {user?.skills?.length > 0 ? (
              user.skills.map((skill, index) => (
                <span key={index}>
                  {skill}
                </span>
              ))
            ) : (
              <span className="no-skills">
                No skills added yet.
              </span>
            )}

          </div>

        </section>

      </div>
    </div>
  );
}

export default Dashboard;