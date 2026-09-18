import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/join-requests/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRequests(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    const token = localStorage.getItem("token");

    setProcessingId(requestId);

    try {
      const response = await fetch(
        `http://localhost:5000/api/join-requests/${requestId}/accept`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        setRequests((prevRequests) =>
          prevRequests.filter(
            (request) => request._id !== requestId
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server connection failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this join request?"
    );

    if (!confirmReject) {
      return;
    }

    const token = localStorage.getItem("token");

    setProcessingId(requestId);

    try {
      const response = await fetch(
        `http://localhost:5000/api/join-requests/${requestId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        setRequests((prevRequests) =>
          prevRequests.filter(
            (request) => request._id !== requestId
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server connection failed");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="join-requests-page loading-page">
        <div className="loading-box">
          <div className="loading-spinner"></div>
          <h2>Loading join requests...</h2>
          <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="join-requests-page">
      <div className="join-requests-container">

        {/* HEADER */}
        <div className="join-requests-header">
          <button
            className="join-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <span className="join-eyebrow">
            TEAM MANAGEMENT
          </span>

          <h1>
            Join Requests <span>🤝</span>
          </h1>

          <p>
            Review people who want to join your projects
            and build your team.
          </p>
        </div>

        {/* REQUEST SUMMARY */}
        <div className="join-summary-card">
          <div className="join-summary-icon">
            📩
          </div>

          <div>
            <div className="join-summary-number">
              {requests.length}
            </div>

            <div className="join-summary-label">
              Pending Request
              {requests.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {requests.length === 0 ? (
          <div className="join-empty-state">
            <div className="join-empty-icon">
              📭
            </div>

            <h2>No pending requests</h2>

            <p>
              When someone wants to join your project,
              their request will appear here.
            </p>

            <button
              className="join-primary-btn"
              onClick={() => navigate("/my-projects")}
            >
              📁 My Projects
            </button>
          </div>
        ) : (
          <div className="join-requests-grid">

            {requests.map((request) => {
              const user = request.user;
              const project = request.project;

              const isProcessing =
                processingId === request._id;

              return (
                <div
                  className="join-request-card"
                  key={request._id}
                >

                  {/* PROJECT HEADER */}
                  <div className="join-project-header">
                    <div>
                      <span className="join-project-label">
                        PROJECT
                      </span>

                      <h2>
                        {project?.title ||
                          "Unknown Project"}
                      </h2>
                    </div>

                    <span className="join-pending-badge">
                      PENDING
                    </span>
                  </div>

                  {/* USER */}
                  <div className="join-user-section">
                    <div className="join-avatar">
                      {user?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div className="join-user-info">
                      <h3>
                        {user?.name ||
                          "Unknown User"}
                      </h3>

                      <p>
                        {user?.email ||
                          "No email available"}
                      </p>
                    </div>
                  </div>

                  {/* EXPERIENCE */}
                  <div className="join-info-row">
                    <span className="join-info-label">
                      ⭐ Experience
                    </span>

                    <span className="join-experience-badge">
                      {user?.experience ||
                        "Beginner"}
                    </span>
                  </div>

                  {/* SKILLS */}
                  <div className="join-skills-section">
                    <p className="join-info-label">
                      🛠️ Skills
                    </p>

                    <div className="join-skills-container">
                      {user?.skills?.length > 0 ? (
                        user.skills.map(
                          (skill, index) => (
                            <span
                              className="join-skill-badge"
                              key={index}
                            >
                              {skill}
                            </span>
                          )
                        )
                      ) : (
                        <span className="join-no-skills">
                          No skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* BIO */}
                  {user?.bio && (
                    <div className="join-bio-section">
                      <p className="join-info-label">
                        📝 About
                      </p>

                      <p className="join-bio-text">
                        {user.bio}
                      </p>
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="join-actions">

                    <button
                      className="join-reject-btn"
                      onClick={() =>
                        handleReject(request._id)
                      }
                      disabled={isProcessing}
                    >
                      {isProcessing
                        ? "Processing..."
                        : "❌ Reject"}
                    </button>

                    <button
                      className="join-accept-btn"
                      onClick={() =>
                        handleAccept(request._id)
                      }
                      disabled={isProcessing}
                    >
                      {isProcessing
                        ? "Processing..."
                        : "✓ Accept"}
                    </button>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default JoinRequests;