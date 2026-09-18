import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! 🎉");

        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);

      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>

      {/* Decorative Background */}

      <div style={glowOne}></div>
      <div style={glowTwo}></div>

      <div style={contentWrapper}>

        {/* Logo */}

        <div style={logoStyle}>
          ProjXTeam <span>🚀</span>
        </div>

        {/* Register Card */}

        <div style={cardStyle}>

          {/* Header */}

          <div style={headerStyle}>

            <div style={iconBox}>
              ✨
            </div>

            <h1 style={titleStyle}>
              Create Your Account
            </h1>

            <p style={subtitleStyle}>
              Join ProjXTeam and find the right
              people to build your next project.
            </p>

          </div>

          {/* Form */}

          <form onSubmit={handleSubmit}>

            {/* Name */}

            <div style={formGroup}>

              <label style={labelStyle}>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />

            </div>

            {/* Email */}

            <div style={formGroup}>

              <label style={labelStyle}>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />

            </div>

            {/* Password */}

            <div style={formGroup}>

              <label style={labelStyle}>
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                style={inputStyle}
              />

              <small style={hintStyle}>
                Use at least 6 characters.
              </small>

            </div>

            {/* Create Account */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...registerButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading
                ? "Creating Account..."
                : "Create Account →"}
            </button>

          </form>

          {/* Divider */}

          <div style={divider}>
            <span style={dividerLine}></span>
            <small style={dividerText}>
              OR
            </small>
            <span style={dividerLine}></span>
          </div>

          {/* Login */}

          <p style={loginText}>
            Already have an account?{" "}

            <Link
              to="/login"
              style={loginLink}
            >
              Login
            </Link>
          </p>

        </div>

        {/* Footer */}

        <p style={footerText}>
          Build together. Learn together. Grow
          together. 🚀
        </p>

      </div>

    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #f5f7fb 0%, #eef2ff 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "30px 20px",
  position: "relative",
  overflow: "hidden",
};

const contentWrapper = {
  width: "100%",
  maxWidth: "430px",
  position: "relative",
  zIndex: 2,
};

const logoStyle = {
  textAlign: "center",
  fontSize: "27px",
  fontWeight: "800",
  color: "#4f46e5",
  marginBottom: "25px",
};

const cardStyle = {
  background: "rgba(255,255,255,0.96)",
  borderRadius: "22px",
  padding: "35px",
  boxShadow:
    "0 20px 60px rgba(79,70,229,0.12)",
  border:
    "1px solid rgba(255,255,255,0.8)",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "28px",
};

const iconBox = {
  width: "55px",
  height: "55px",
  margin: "0 auto 15px",
  borderRadius: "16px",
  background: "#eef2ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "25px",
};

const titleStyle = {
  margin: 0,
  color: "#111827",
  fontSize: "27px",
  fontWeight: "800",
};

const subtitleStyle = {
  margin: "10px 0 0",
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.6",
};

const formGroup = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#374151",
  fontSize: "13px",
  fontWeight: "700",
};

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "11px",
  fontSize: "14px",
  outline: "none",
  color: "#111827",
  background: "white",
  boxSizing: "border-box",
};

const hintStyle = {
  display: "block",
  marginTop: "6px",
  color: "#9ca3af",
  fontSize: "11px",
};

const registerButton = {
  width: "100%",
  border: "none",
  background:
    "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "white",
  padding: "14px",
  borderRadius: "11px",
  fontSize: "15px",
  fontWeight: "700",
  marginTop: "5px",
};

const divider = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  margin: "25px 0",
};

const dividerLine = {
  height: "1px",
  background: "#e5e7eb",
  flex: 1,
};

const dividerText = {
  color: "#9ca3af",
  fontSize: "11px",
};

const loginText = {
  textAlign: "center",
  margin: 0,
  color: "#6b7280",
  fontSize: "13px",
};

const loginLink = {
  color: "#4f46e5",
  fontWeight: "700",
  textDecoration: "none",
};

const footerText = {
  textAlign: "center",
  color: "#9ca3af",
  fontSize: "12px",
  marginTop: "20px",
};

const glowOne = {
  position: "absolute",
  width: "300px",
  height: "300px",
  borderRadius: "50%",
  background: "#c7d2fe",
  filter: "blur(100px)",
  opacity: 0.35,
  top: "-100px",
  left: "-100px",
};

const glowTwo = {
  position: "absolute",
  width: "300px",
  height: "300px",
  borderRadius: "50%",
  background: "#ddd6fe",
  filter: "blur(100px)",
  opacity: 0.35,
  bottom: "-100px",
  right: "-100px",
};

export default Register;