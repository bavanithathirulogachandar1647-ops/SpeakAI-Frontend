import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log("REGISTER RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.error || "Registration failed."
        );
      }

      setSuccess(
        "Registration successful! You can now login."
      );

      // Clear form
      setName("");
      setEmail("");
      setPassword("");

    } catch (err) {
      console.error("REGISTER ERROR:", err);

      setError(
        err.message ||
        "Unable to register. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    window.location.href = "/";
  };

  return (
    <div style={styles.page}>

      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            🌐
          </div>

          <h1 style={styles.logo}>
            SpeakAI
          </h1>

          <p style={styles.tagline}>
            AI-Powered Language Learning
          </p>
        </div>

        {/* Title */}
        <h2 style={styles.title}>
          Create Your Account 🚀
        </h2>

        <p style={styles.subtitle}>
          Join SpeakAI and start your AI-powered
          language learning journey.
        </p>

        {/* Error */}
        {error && (
          <div style={styles.error}>
            <strong>Registration Error</strong>
            <br />
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={styles.success}>
            <strong>Success!</strong>
            <br />
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister}>

          {/* Name */}
          <label style={styles.label}>
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter your full name"
            style={styles.input}
            autoComplete="name"
          />

          {/* Email */}
          <label style={styles.label}>
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            style={styles.input}
            autoComplete="email"
          />

          {/* Password */}
          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Create a password"
            style={styles.input}
            autoComplete="new-password"
          />

          <p style={styles.passwordHint}>
            Password must contain at least 6 characters.
          </p>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.registerButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login */}
        <div style={styles.loginSection}>

          <p style={styles.loginText}>
            Already have an account?
          </p>

          <button
            onClick={goToLogin}
            style={styles.loginButton}
          >
            Login to SpeakAI
          </button>

        </div>

      </div>

      {/* Footer */}
      <p style={styles.footer}>
        © 2026 SpeakAI • AI-Powered Language Learning
      </p>

    </div>
  );
}


/* =========================
   STYLES
========================= */

const styles = {

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #eef2ff, #f8fafc)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px 20px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "22px",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.10)",
    boxSizing: "border-box",
  },

  logoContainer: {
    textAlign: "center",
    marginBottom: "28px",
  },

  logoIcon: {
    fontSize: "48px",
    marginBottom: "5px",
  },

  logo: {
    margin: "0",
    color: "#4f46e5",
    fontSize: "32px",
    fontWeight: "700",
  },

  tagline: {
    marginTop: "7px",
    color: "#64748b",
    fontSize: "14px",
  },

  title: {
    fontSize: "25px",
    color: "#1e293b",
    marginBottom: "8px",
    textAlign: "center",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "15px",
    textAlign: "center",
    marginBottom: "25px",
    lineHeight: "1.5",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "14px",
    border:
      "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
  },

  passwordHint: {
    color: "#94a3b8",
    fontSize: "12px",
    marginTop: "7px",
  },

  registerButton: {
    width: "100%",
    padding: "14px",
    marginTop: "22px",
    border: "none",
    borderRadius: "11px",
    background: "#4f46e5",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "13px",
    borderRadius: "10px",
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "15px",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "13px",
    borderRadius: "10px",
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "15px",
  },

  loginSection: {
    textAlign: "center",
    marginTop: "28px",
    paddingTop: "22px",
    borderTop:
      "1px solid #e2e8f0",
  },

  loginText: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "10px",
  },

  loginButton: {
    background: "transparent",
    border: "none",
    color: "#4f46e5",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  footer: {
    marginTop: "20px",
    color: "#64748b",
    fontSize: "13px",
    textAlign: "center",
  },

};

export default Register;