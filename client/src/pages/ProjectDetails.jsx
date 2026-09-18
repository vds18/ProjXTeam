import { API_URL } from "../config";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/projects/${id}`
      );

      const data = await response.json();

      if (response.ok) {
        setProject(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEND JOIN REQUEST
  // ==========================================
  const handleJoinRequest = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/join-requests/${id}`,
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
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server connection failed");
    }
  };

  // ==========================================
  // DELETE PROJECT
  // ==========================================
  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    setDeleting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate("/my-projects");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server connection failed");
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle}>⏳</div>
        <h2>Loading project...</h2>
      </div>
    );
  }

  // ==========================================
  // PROJECT NOT FOUND
  // ==========================================
  if (!project) {
    return (
      <div style={loadingStyle}>
        <h2>Project not found 😕</h2>

        <button
          onClick={() => navigate("/projects")}
          style={primaryButton}
        >
          ← Back to Projects
        </button>
      </div>
    );
  }

  const currentMembers = project.members?.length || 0;

  const availableSpots = Math.max(
    project.teamSize - currentMembers,
    0
  );

  const isFull = availableSpots === 0;

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const isCreator =
    currentUser?._id === project.creator?._id;

  // ==========================================
  // CHECK TEAM MEMBERSHIP
  // ==========================================
  const isTeamMember = project.members?.some(
    (member) =>
      (typeof member === "object"
        ? member._id
        : member) === currentUser?._id
  );

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>

        {/* Back */}
        <button
          onClick={() => navigate("/projects")}
          style={backButton}
        >
          ← Back to Projects
        </button>

        {/* Hero */}
        <div style={heroStyle}>
          <div>
            <span style={badgeStyle}>
              🚀 Open Project
            </span>

            <h1 style={titleStyle}>
              {project.title}
            </h1>

            <p style={descriptionStyle}>
              {project.description}
            </p>
          </div>
        </div>

        {/* Creator Controls */}
        {isCreator && (
          <div style={managementCard}>
            <div>
              <h3 style={managementTitle}>
                Project Management
              </h3>

              <p style={managementText}>
                You are the creator of this project.
              </p>
            </div>

            <div style={managementButtons}>
              <button
                onClick={() =>
                  navigate(`/projects/${id}/edit`)
                }
                style={editButton}
              >
                ✏️ Edit Project
              </button>

              <button
                onClick={handleDeleteProject}
                disabled={deleting}
                style={deleteButton}
              >
                {deleting
                  ? "Deleting..."
                  : "🗑️ Delete Project"}
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={statsGrid}>

          <div style={statCard}>
            <span style={statIcon}>👥</span>

            <div>
              <strong>
                {currentMembers}/{project.teamSize}
              </strong>

              <p>Team Members</p>
            </div>
          </div>

          <div style={statCard}>
            <span style={statIcon}>🎯</span>

            <div>
              <strong>{availableSpots}</strong>

              <p>Spots Available</p>
            </div>
          </div>

          <div style={statCard}>
            <span style={statIcon}>⏳</span>

            <div>
              <strong>
                {project.duration || "Flexible"}
              </strong>

              <p>Duration</p>
            </div>
          </div>

        </div>

        {/* Main Grid */}
        <div style={mainGrid}>

          {/* Left */}
          <div>

            {/* Skills */}
            <div style={cardStyle}>
              <h2 style={sectionTitle}>
                🛠️ Required Skills
              </h2>

              <div style={skillsContainer}>
                {project.skills?.length > 0 ? (
                  project.skills.map((skill, index) => (
                    <span
                      key={index}
                      style={skillStyle}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p style={mutedText}>
                    No specific skills listed.
                  </p>
                )}
              </div>
            </div>

            {/* Creator */}
            <div style={cardStyle}>
              <h2 style={sectionTitle}>
                👤 Project Creator
              </h2>

              <div style={creatorBox}>
                <div style={avatar}>
                  {project.creator?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>

                <div>
                  <h3 style={{ margin: 0 }}>
                    {project.creator?.name ||
                      "Unknown"}
                  </h3>

                  <p style={mutedText}>
                    {project.creator?.email}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right */}
          <div>

            {/* Team */}
            <div style={cardStyle}>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2 style={sectionTitle}>
                  👥 Team
                </h2>

                <span
                  style={{
                    color: isFull
                      ? "#dc2626"
                      : "#16a34a",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  {isFull
                    ? "Team Full"
                    : `${availableSpots} spot${
                        availableSpots !== 1
                          ? "s"
                          : ""
                      } left`}
                </span>
              </div>

              <div style={membersContainer}>
                {project.members?.map((member) => (
                  <div
                    key={member._id}
                    style={memberCard}
                  >
                    <div style={memberAvatar}>
                      {member.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <strong>
                        {member.name}
                      </strong>

                      <p style={memberEmail}>
                        {member.email}
                      </p>

                      {member.experience && (
                        <span style={experienceBadge}>
                          {member.experience}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Send Join Request */}
              {!isCreator && (
                <button
                  onClick={handleJoinRequest}
                  disabled={isFull}
                  style={{
                    ...primaryButton,
                    background: isFull
                      ? "#9ca3af"
                      : "#4f46e5",
                    cursor: isFull
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {isFull
                    ? "🔒 Team Full"
                    : "🤝 Send Join Request"}
                </button>
              )}

              {/* Creator Notice */}
              {isCreator && (
                <div style={creatorNotice}>
                  👑 You are the project creator.
                </div>
              )}

              {/* Team Chat */}
              {(isCreator || isTeamMember) && (
                <button
                  onClick={() =>
                    navigate(`/projects/${id}/chat`)
                  }
                  style={{
                    ...primaryButton,
                    background: "#111827",
                    marginTop: "10px",
                    cursor: "pointer",
                  }}
                >
                  💬 Team Chat
                </button>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}


// ==========================================
// STYLES
// ==========================================

const pageStyle = {
  minHeight: "100vh",
  background: "#f5f7fb",
  padding: "35px 20px",
};

const containerStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const loadingStyle = {
  minHeight: "80vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
};

const spinnerStyle = {
  fontSize: "35px",
};

const backButton = {
  border: "none",
  background: "transparent",
  color: "#4f46e5",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  marginBottom: "20px",
};

const heroStyle = {
  background:
    "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "white",
  borderRadius: "22px",
  padding: "40px",
  marginBottom: "20px",
};

const badgeStyle = {
  background: "rgba(255,255,255,0.18)",
  padding: "7px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "600",
};

const titleStyle = {
  fontSize: "38px",
  margin: "18px 0 10px",
};

const descriptionStyle = {
  maxWidth: "750px",
  lineHeight: "1.7",
  opacity: 0.9,
  fontSize: "16px",
};

const managementCard = {
  background: "white",
  borderRadius: "16px",
  padding: "20px 24px",
  marginBottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
  boxShadow:
    "0 5px 20px rgba(0,0,0,0.05)",
};

const managementTitle = {
  margin: 0,
  color: "#111827",
};

const managementText = {
  margin: "5px 0 0",
  color: "#6b7280",
  fontSize: "13px",
};

const managementButtons = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const editButton = {
  border: "none",
  background: "#eef2ff",
  color: "#4f46e5",
  padding: "10px 15px",
  borderRadius: "9px",
  fontWeight: "600",
  cursor: "pointer",
};

const deleteButton = {
  border: "none",
  background: "#fee2e2",
  color: "#dc2626",
  padding: "10px 15px",
  borderRadius: "9px",
  fontWeight: "600",
  cursor: "pointer",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
  marginBottom: "20px",
};

const statCard = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  boxShadow:
    "0 5px 20px rgba(0,0,0,0.05)",
};

const statIcon = {
  fontSize: "28px",
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "white",
  borderRadius: "18px",
  padding: "25px",
  marginBottom: "20px",
  boxShadow:
    "0 5px 20px rgba(0,0,0,0.05)",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: "18px",
  color: "#111827",
};

const skillsContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const skillStyle = {
  background: "#eef2ff",
  color: "#4f46e5",
  padding: "8px 13px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "600",
};

const mutedText = {
  color: "#6b7280",
  fontSize: "14px",
};

const creatorBox = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const avatar = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "#4f46e5",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  fontWeight: "700",
};

const membersContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const memberCard = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background: "#f9fafb",
  padding: "14px",
  borderRadius: "12px",
};

const memberAvatar = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "#e0e7ff",
  color: "#4f46e5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
};

const memberEmail = {
  margin: "4px 0",
  color: "#6b7280",
  fontSize: "12px",
};

const experienceBadge = {
  fontSize: "11px",
  background: "#ecfdf5",
  color: "#047857",
  padding: "4px 8px",
  borderRadius: "10px",
};

const primaryButton = {
  width: "100%",
  marginTop: "20px",
  padding: "14px",
  border: "none",
  borderRadius: "11px",
  color: "white",
  fontSize: "15px",
  fontWeight: "700",
};

const creatorNotice = {
  marginTop: "20px",
  padding: "12px",
  background: "#fef3c7",
  color: "#92400e",
  borderRadius: "10px",
  textAlign: "center",
  fontSize: "13px",
  fontWeight: "600",
};

export default ProjectDetails;