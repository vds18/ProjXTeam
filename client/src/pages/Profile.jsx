import { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    interests: "",
    experience: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

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

        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          skills: data.skills?.join(", ") || "",
          interests: data.interests?.join(", ") || "",
          experience: data.experience || "Beginner",
        });
      } else {
        alert(data.message || "Failed to load profile");
      }
    } catch (error) {
      console.error(error);
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

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            bio: formData.bio,

            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill !== ""),

            interests: formData.interests
              .split(",")
              .map((interest) => interest.trim())
              .filter((interest) => interest !== ""),

            experience: formData.experience,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");

        setUser(data.user);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection failed");
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-card">
          <div className="profile-loading-icon">
            👤
          </div>

          <h2>Loading your profile...</h2>

          <p>
            Getting everything ready for you.
          </p>

          <div className="profile-loading-bar">
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     PROFILE COMPLETION
  ========================= */

  const profileScore =
    (user?.name ? 20 : 0) +
    (user?.bio ? 20 : 0) +
    (user?.skills?.length > 0 ? 20 : 0) +
    (user?.interests?.length > 0 ? 20 : 0) +
    (user?.experience ? 20 : 0);

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* =========================
            PROFILE HERO
        ========================= */}

        <section className="profile-hero">

          <div className="profile-hero-glow"></div>

          <div className="profile-avatar">
            {firstLetter}
          </div>

          <div className="profile-hero-content">

            <span className="profile-eyebrow">
              ✨ PROJXTEAM MEMBER
            </span>

            <h1>
              {user?.name || "User"}
            </h1>

            <p className="profile-role">
              {user?.experience || "Developer"}
              <span>•</span>
              Building teams & projects
            </p>

            <div className="profile-email">
              📧 {user?.email}
            </div>

          </div>

          <div className="profile-level-badge">
            <span>LEVEL</span>
            <strong>
              {user?.experience || "Beginner"}
            </strong>
          </div>

        </section>


        {/* =========================
            PROFILE STATS
        ========================= */}

        <section className="profile-stats">

          <div className="profile-stat-card">
            <div className="profile-stat-icon purple">
              🛠️
            </div>

            <div>
              <strong>
                {user?.skills?.length || 0}
              </strong>

              <span>Skills</span>
            </div>
          </div>


          <div className="profile-stat-card">
            <div className="profile-stat-icon pink">
              💡
            </div>

            <div>
              <strong>
                {user?.interests?.length || 0}
              </strong>

              <span>Interests</span>
            </div>
          </div>


          <div className="profile-stat-card">
            <div className="profile-stat-icon blue">
              🎯
            </div>

            <div>
              <strong>
                {user?.experience || "—"}
              </strong>

              <span>Experience</span>
            </div>
          </div>


          <div className="profile-stat-card">
            <div className="profile-stat-icon green">
              ✨
            </div>

            <div>
              <strong>
                {profileScore}%
              </strong>

              <span>Profile Complete</span>
            </div>
          </div>

        </section>


        {/* =========================
            COMPLETION
        ========================= */}

        <section className="profile-card completion-card">

          <div className="completion-header">

            <div>
              <span className="section-eyebrow">
                PROFILE HEALTH
              </span>

              <h2>
                Complete your profile
              </h2>

              <p>
                A complete profile helps you get
                better project matches.
              </p>
            </div>

            <div className="completion-percentage">
              {profileScore}%
            </div>

          </div>

          <div className="profile-progress">
            <div
              style={{
                width: `${profileScore}%`,
              }}
            />
          </div>

          <div className="completion-status">
            {profileScore === 100
              ? "🎉 Your profile is complete!"
              : "Add more information to improve your matches."}
          </div>

        </section>


        {/* =========================
            ABOUT + DETAILS
        ========================= */}

        <section className="profile-card profile-overview">

          <div className="card-heading">

            <div>
              <span className="section-eyebrow">
                ABOUT
              </span>

              <h2>About Me</h2>
            </div>

            <span className="card-heading-icon">
              👋
            </span>

          </div>

          <p className="about-text">
            {user?.bio ||
              "No bio added yet. Tell potential teammates about yourself."}
          </p>


          {/* DETAILS */}

          <div className="profile-details">

            <div className="detail-box">
              <span className="detail-icon">
                🎯
              </span>

              <div>
                <small>Experience</small>

                <strong>
                  {user?.experience ||
                    "Not specified"}
                </strong>
              </div>
            </div>


            <div className="detail-box">
              <span className="detail-icon">
                🛠️
              </span>

              <div>
                <small>Skills</small>

                <strong>
                  {user?.skills?.length || 0}
                </strong>
              </div>
            </div>


            <div className="detail-box">
              <span className="detail-icon">
                💡
              </span>

              <div>
                <small>Interests</small>

                <strong>
                  {user?.interests?.length || 0}
                </strong>
              </div>
            </div>

          </div>


          {/* =========================
              SKILLS
          ========================= */}

          <div className="profile-section">

            <div className="profile-section-title">
              <h3>🛠️ Technical Skills</h3>

              <span>
                {user?.skills?.length || 0}
              </span>
            </div>

            <div className="skills">

              {user?.skills?.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span
                    className="skill"
                    key={index}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="muted">
                  No skills added yet.
                </p>
              )}

            </div>

          </div>


          {/* =========================
              INTERESTS
          ========================= */}

          <div className="profile-section">

            <div className="profile-section-title">
              <h3>💡 Interests</h3>

              <span>
                {user?.interests?.length || 0}
              </span>
            </div>

            <div className="skills">

              {user?.interests?.length > 0 ? (
                user.interests.map(
                  (interest, index) => (
                    <span
                      className="skill interest-skill"
                      key={index}
                    >
                      💡 {interest}
                    </span>
                  )
                )
              ) : (
                <p className="muted">
                  No interests added yet.
                </p>
              )}

            </div>

          </div>

        </section>


        {/* =========================
            EDIT PROFILE
        ========================= */}

        <section className="profile-card edit-profile-card">

          <div className="edit-header">

            <div>
              <span className="section-eyebrow">
                PERSONALIZE
              </span>

              <h2>Edit Profile</h2>

              <p>
                Keep your profile updated so the
                right teammates can discover you.
              </p>
            </div>

            <div className="edit-icon">
              ✏️
            </div>

          </div>


          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />

            </div>


            {/* BIO */}

            <div className="form-group">

              <label>
                Bio
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell teammates about yourself..."
                rows="4"
              />

              <small>
                Introduce yourself, your strengths and
                what you're looking to build.
              </small>

            </div>


            {/* SKILLS */}

            <div className="form-group">

              <label>
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB, Java"
              />

              <small>
                Separate multiple skills with commas.
              </small>

            </div>


            {/* INTERESTS */}

            <div className="form-group">

              <label>
                Interests
              </label>

              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="AI, Web Development, Hackathons"
              />

              <small>
                Separate multiple interests with commas.
              </small>

            </div>


            {/* EXPERIENCE */}

            <div className="form-group">

              <label>
                Experience Level
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

                <option value="Expert">
                  Expert
                </option>
              </select>

            </div>


            {/* SAVE */}

            <button
              className="save-btn"
              type="submit"
            >
              <span>✓</span>
              Save Changes
            </button>

          </form>

        </section>

      </div>

    </div>
  );
}

export default Profile;