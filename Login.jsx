import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            console.log("LOGIN RESPONSE:", data);

            if (!response.ok) {
                throw new Error(
                    data.error || "Login failed. Please check your details."
                );
            }

            // Save JWT token
            localStorage.setItem(
                "access_token",
                data.access_token
            );

            // Save user information
            localStorage.setItem(
                "user_id",
                String(data.user_id)
            );

            localStorage.setItem(
                "user_name",
                data.name
            );

            localStorage.setItem(
                "user_email",
                data.email
            );

            // Go to dashboard
            window.location.href = "/dashboard";

        } catch (err) {
            console.error("LOGIN ERROR:", err);

            setError(
                err.message ||
                "Unable to login. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    const goToRegister = () => {
        window.location.href = "/register";
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
                    Welcome Back 👋
                </h2>

                <p style={styles.subtitle}>
                    Login to continue your learning journey.
                </p>

                {/* Error */}
                {error && (
                    <div style={styles.error}>
                        <strong>Login Error</strong>
                        <br />
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin}>

                    {/* Email */}
                    <label style={styles.label}>
                        Email Address
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        style={styles.input}
                        autoComplete="current-password"
                    />

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.loginButton,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                        }}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                {/* Register */}
                <div style={styles.registerSection}>

                    <p style={styles.registerText}>
                        Don't have an account?
                    </p>

                    <button
                        onClick={goToRegister}
                        style={styles.registerButton}
                    >
                        Create New Account
                    </button>

                </div>

            </div>

            {/* Footer */}
            <p style={styles.footer}>
                © 2026 SpeakAI • Learn English with AI
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
        maxWidth: "430px",
        background: "#ffffff",
        padding: "40px",
        borderRadius: "22px",
        boxShadow:
            "0 15px 40px rgba(0,0,0,0.10)",
        boxSizing: "border-box",
    },

    logoContainer: {
        textAlign: "center",
        marginBottom: "30px",
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

    loginButton: {
        width: "100%",
        padding: "14px",
        marginTop: "25px",
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

    registerSection: {
        textAlign: "center",
        marginTop: "28px",
        paddingTop: "22px",
        borderTop:
            "1px solid #e2e8f0",
    },

    registerText: {
        color: "#64748b",
        fontSize: "14px",
        marginBottom: "10px",
    },

    registerButton: {
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

export default Login;