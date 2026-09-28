import { useState } from "react";

function Grammar() {
    const [text, setText] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const checkGrammar = async () => {
        if (!text.trim()) {
            setError("Please enter a sentence.");
            return;
        }

        setLoading(true);
        setFeedback("");
        setError("");

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/grammar-correction",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: text,
                    }),
                }
            );

            const data = await response.json();

            console.log("GRAMMAR RESPONSE:", data);

            if (!response.ok) {
                throw new Error(
                    data.error || "Grammar correction failed"
                );
            }

            setFeedback(
                data.feedback || "No feedback received."
            );

        } catch (err) {
            console.error("GRAMMAR ERROR:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>

            <div style={styles.card}>

                <button
                    onClick={() => {
                        window.location.href = "/dashboard";
                    }}
                    style={styles.backButton}
                >
                    ← Back to Dashboard
                </button>

                <h1 style={styles.title}>
                    ✍️ Grammar Correction
                </h1>

                <p style={styles.subtitle}>
                    Improve your English grammar with AI-powered feedback.
                </p>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your English sentence here..."
                    style={styles.textarea}
                    rows="6"
                />

                <button
                    onClick={checkGrammar}
                    disabled={loading}
                    style={styles.button}
                >
                    {loading ? "Checking..." : "Check Grammar"}
                </button>

                {error && (
                    <div style={styles.error}>
                        <strong>Error:</strong>
                        <br />
                        {error}
                    </div>
                )}

                {feedback && (
                    <div style={styles.feedback}>

                        <h2>🤖 AI Feedback</h2>

                        <div style={styles.feedbackText}>
                            {feedback}
                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #eef2ff, #f8fafc)",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
    },

    card: {
        maxWidth: "850px",
        margin: "0 auto",
        background: "#ffffff",
        padding: "35px",
        borderRadius: "20px",
        boxShadow:
            "0 10px 35px rgba(0,0,0,0.08)",
    },

    backButton: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: "15px",
        marginBottom: "20px",
    },

    title: {
        fontSize: "32px",
        marginBottom: "10px",
    },

    subtitle: {
        color: "#64748b",
        fontSize: "16px",
        marginBottom: "25px",
    },

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        fontSize: "16px",
        resize: "vertical",
        outline: "none",
        marginBottom: "20px",
    },

    button: {
        width: "100%",
        padding: "14px",
        border: "none",
        borderRadius: "12px",
        background: "#4f46e5",
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
    },

    feedback: {
        marginTop: "30px",
        padding: "25px",
        borderRadius: "15px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
    },

    feedbackText: {
        whiteSpace: "pre-wrap",
        lineHeight: "1.7",
        fontSize: "16px",
        color: "#334155",
    },

    error: {
        marginTop: "20px",
        padding: "15px",
        borderRadius: "10px",
        background: "#fee2e2",
        color: "#991b1b",
    },
};

export default Grammar;