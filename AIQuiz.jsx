import { useState } from "react";

function AIQuiz() {
    const [topic, setTopic] = useState("");
    const [quiz, setQuiz] = useState("");
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generateQuiz = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic.");
            return;
        }

        setLoading(true);
        setError("");
        setQuiz("");
        setScore(null);

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/generate-quiz",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        topic: topic,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Quiz generation failed"
                );
            }

            setQuiz(data.quiz || "No quiz received.");

        } catch (err) {
            console.error("QUIZ ERROR:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const saveQuizScore = async () => {
        const userId = localStorage.getItem("user_id");
        const token = localStorage.getItem("access_token");

        if (!userId || !token) {
            setError("Please login again.");
            return;
        }

        const enteredScore = prompt(
            "Enter your quiz score (0-100):"
        );

        if (enteredScore === null) {
            return;
        }

        const quizScore = Number(enteredScore);

        if (
            isNaN(quizScore) ||
            quizScore < 0 ||
            quizScore > 100
        ) {
            setError("Please enter a score between 0 and 100.");
            return;
        }

        try {
            const progressResponse = await fetch(
                `http://127.0.0.1:5000/progress/${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const progress = await progressResponse.json();

            if (!progressResponse.ok) {
                throw new Error(
                    progress.error || "Unable to get progress"
                );
            }

            const updateResponse = await fetch(
                "http://127.0.0.1:5000/progress",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        user_id: Number(userId),
                        vocabulary_completed:
                            Number(progress.vocabulary_completed || 0),

                        grammar_completed:
                            Number(progress.grammar_completed || 0),

                        quiz_score: quizScore,

                        pronunciation_completed:
                            Number(
                                progress.pronunciation_completed || 0
                            ),
                    }),
                }
            );

            const result = await updateResponse.json();

            if (!updateResponse.ok) {
                throw new Error(
                    result.error || "Unable to save quiz score"
                );
            }

            setScore(quizScore);
            alert("Quiz score saved successfully! 🎉");

        } catch (err) {
            console.error("QUIZ SCORE ERROR:", err);
            setError(err.message);
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
                    📝 AI Quiz
                </h1>

                <p style={styles.subtitle}>
                    Generate an AI-powered English quiz.
                </p>

                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic (Example: Grammar)"
                    style={styles.input}
                />

                <button
                    onClick={generateQuiz}
                    disabled={loading}
                    style={styles.button}
                >
                    {loading ? "Generating..." : "Generate Quiz"}
                </button>

                {error && (
                    <div style={styles.error}>
                        <strong>Error:</strong>
                        <br />
                        {error}
                    </div>
                )}

                {quiz && (
                    <div style={styles.quizBox}>

                        <h2>🤖 AI Generated Quiz</h2>

                        <div style={styles.quizText}>
                            {quiz}
                        </div>

                        <button
                            onClick={saveQuizScore}
                            style={styles.saveButton}
                        >
                            💾 Save Quiz Score
                        </button>

                        {score !== null && (
                            <div style={styles.score}>
                                Your saved score: {score}%
                            </div>
                        )}

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

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "15px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        fontSize: "16px",
        marginBottom: "15px",
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

    quizBox: {
        marginTop: "30px",
        padding: "25px",
        borderRadius: "15px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
    },

    quizText: {
        whiteSpace: "pre-wrap",
        lineHeight: "1.7",
        fontSize: "16px",
        color: "#334155",
    },

    saveButton: {
        width: "100%",
        marginTop: "25px",
        padding: "14px",
        border: "none",
        borderRadius: "12px",
        background: "#16a34a",
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
    },

    score: {
        marginTop: "20px",
        padding: "15px",
        borderRadius: "10px",
        background: "#dcfce7",
        color: "#166534",
        fontWeight: "bold",
        textAlign: "center",
    },

    error: {
        marginTop: "20px",
        padding: "15px",
        borderRadius: "10px",
        background: "#fee2e2",
        color: "#991b1b",
    },
};

export default AIQuiz;