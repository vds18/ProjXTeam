import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    teamSize: "",
    duration: "",
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}`
      );

      const data = await response.json();

      if (response.ok) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          skills: data.skills?.join(", ") || "",
          teamSize: data.teamSize || "",
          duration: data.duration || "",
        });
      } else {
        alert(data.message);
        navigate("/my-projects");
      }
    } catch (error) {
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    setSaving(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}`,
        {
          method: "PUT",
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
            teamSize: Number(formData.teamSize),
            duration: formData.duration,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Project updated successfully! ✅");
        navigate(`/projects/${id}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server connection failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-project-page loading-page">
        <div className="loading-box">
          <div className="loading-spinner"></div>
          <h2>Loading project...</h2>
          <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-project-page">
      <div className="edit-project-container">

        {/* Back Button */}
        <button
          className="edit-back-btn"
          onClick={() => navigate(`/projects/${id}`)}
        >
          ← Back to Project
        </button>

        {/* Header */}
        <div className="edit-project-header">
          <div>
            <span className="edit-eyebrow">
              PROJECT MANAGEMENT
            </span>

            <h1>
              Edit Project <span>✏️</span>
            </h1>

            <p>
              Update your project details and
              requirements.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="edit-project-card">

          <form onSubmit={handleSubmit}>

            {/* Basic Information */}
            <section className="edit-section">
              <div className="edit-section-heading">
                <div className="edit-section-icon">
                  📋
                </div>

                <div>
                  <h2>Basic Information</h2>
                  <p>
                    Update the core details of your
                    project.
                  </p>
                </div>
              </div>

              {/* Project Title */}
              <div className="edit-form-group">
                <label htmlFor="title">
                  Project Title
                  <span>*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  required
                />
              </div>

              {/* Description */}
              <div className="edit-form-group">
                <label htmlFor="description">
                  Project Description
                  <span>*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project, its goals, and what you want to build..."
                  required
                />
              </div>
            </section>

            {/* Team Requirements */}
            <section className="edit-section">
              <div className="edit-section-heading">
                <div className="edit-section-icon">
                  👥
                </div>

                <div>
                  <h2>Team Requirements</h2>
                  <p>
                    Define the skills and team
                    requirements.
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="edit-form-group">
                <label htmlFor="skills">
                  Required Skills
                </label>

                <input
                  id="skills"
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                />

                <small>
                  Separate multiple skills with
                  commas.
                </small>
              </div>

              {/* Two Column */}
              <div className="edit-two-column">

                {/* Team Size */}
                <div className="edit-form-group">
                  <label htmlFor="teamSize">
                    Team Size
                    <span>*</span>
                  </label>

                  <input
                    id="teamSize"
                    type="number"
                    name="teamSize"
                    min="1"
                    value={formData.teamSize}
                    onChange={handleChange}
                    required
                  />

                  <small>
                    Cannot be smaller than current
                    members.
                  </small>
                </div>

                {/* Duration */}
                <div className="edit-form-group">
                  <label htmlFor="duration">
                    Project Duration
                  </label>

                  <input
                    id="duration"
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 2 months"
                  />

                  <small>
                    Example: 4 weeks, 2 months.
                  </small>
                </div>

              </div>
            </section>

            {/* Update Notice */}
            <div className="edit-smart-box">
              <div className="edit-smart-icon">
                💡
              </div>

              <div>
                <strong>Keep your project updated</strong>

                <p>
                  Clear project details help potential
                  teammates understand your requirements
                  and decide if your project is a good fit.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="edit-actions">

              <button
                type="button"
                className="edit-cancel-btn"
                onClick={() =>
                  navigate(`/projects/${id}`)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="edit-save-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="edit-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    Save Changes
                    <span>✓</span>
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

export default EditProject;