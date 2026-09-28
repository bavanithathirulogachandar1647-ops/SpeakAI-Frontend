import { useEffect, useState } from "react";

function Progress() {
    const userId = localStorage.getItem("user_id");
    const userName = localStorage.getItem("user_name") || "Learner";
    const token = localStorage.getItem("access_token");

    const [progress, setProgress] = useState({
        vocabulary_completed: 0,
        grammar_completed: 0,
        quiz_score: 0,
        pronunciation_completed: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        if (!userId || !token) {
            setLoading(false);
            setError("Please login again.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/progress/${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            console.log("PROGRESS RESPONSE:", data);

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to get progress"
                );
            }

            setProgress({
                vocabulary_completed:
                    data.vocabulary_completed || 0,

                grammar_completed:
                    data.grammar_completed || 0,

                quiz_score:
                    data.quiz_score || 0,

                pronunciation_completed:
                    data.pronunciation_completed || 0,
            });

        } catch (error) {
            console.error("Progress error:", error);
            setError(error.message);
        }

        setLoading(false);
    };

    // Convert completed activities to percentages

    const vocabularyProgress = Math.min(
        progress.vocabulary_completed * 10,
        100
    );

    const grammarProgress = Math.min(
        progress.grammar_completed * 10,
        100
    );

    const speakingProgress = Math.min(
        progress.pronunciation_completed * 10,
        100
    );

    const overallProgress = Math.round(
        (
            vocabularyProgress +
            grammarProgress +
            speakingProgress +
            progress.quiz_score
        ) / 4
    );

    const getLevel = () => {
        if (overallProgress >= 80) return "Advanced";
        if (overallProgress >= 50) return "Intermediate";
        if (overallProgress >= 20) return "Beginner";
        return "Getting Started";
    };

    const getMessage = () => {
        if (overallProgress >= 80) {
            return "Excellent work! You are making great progress. 🏆";
        }

        if (overallProgress >= 50) {
            return "Great job! Keep practicing to reach the next level. 🚀";
        }

        if (overallProgress >= 20) {
            return "Good start! Practice regularly and keep improving. 💪";
        }

        return "Start practicing today and build your English skills. 🌱";
    };

    const goDashboard = () => {
        window.location.href = "/dashboard";
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_email");

        window.location.href = "/";
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                fontFamily: "Arial, Helvetica, sans-serif",
                color: "#1e293b",
            }}
        >

            {/* ================= HEADER ================= */}

            <header
                style={{
                    background: "#ffffff",
                    minHeight: "74px",
                    padding: "0 40px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    boxSizing: "border-box",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >

                    <span style={{ fontSize: "32px" }}>
                        🗣️
                    </span>

                    <h2
                        style={{
                            margin: 0,
                            color: "#2563eb",
                            fontSize: "30px",
                        }}
                    >
                        SpeakAI
                    </h2>

                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                    }}
                >

                    <span
                        style={{
                            fontWeight: "600",
                            color: "#334155",
                        }}
                    >
                        👋 {userName}
                    </span>

                    <button
                        onClick={logout}
                        style={{
                            padding: "11px 20px",
                            border: "none",
                            borderRadius: "9px",
                            background: "#ef4444",
                            color: "white",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        Logout
                    </button>

                </div>

            </header>

            {/* ================= MAIN ================= */}

            <main
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    padding: "40px 25px 60px",
                    boxSizing: "border-box",
                }}
            >

                {/* Page Title */}

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "35px",
                    }}
                >

                    <div style={{ fontSize: "55px" }}>
                        📊
                    </div>

                    <h1
                        style={{
                            margin: "10px 0",
                            fontSize: "38px",
                            color: "#1e293b",
                        }}
                    >
                        Your Learning Progress
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#64748b",
                            fontSize: "17px",
                        }}
                    >
                        Track your English learning journey with SpeakAI.
                    </p>

                </div>

                {loading ? (

                    <div
                        style={{
                            background: "white",
                            padding: "50px",
                            borderRadius: "20px",
                            textAlign: "center",
                        }}
                    >
                        Loading your progress...
                    </div>

                ) : error ? (

                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            padding: "25px",
                            borderRadius: "15px",
                            textAlign: "center",
                            marginBottom: "25px",
                        }}
                    >
                        <strong>Error:</strong>
                        <br />
                        {error}

                        <br />
                        <br />

                        <button
                            onClick={() => {
                                window.location.href = "/";
                            }}
                            style={{
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "8px",
                                background: "#dc2626",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            Login Again
                        </button>
                    </div>

                ) : (

                    <>

                        {/* ================= OVERALL ================= */}

                        <section
                            style={{
                                background:
                                    "linear-gradient(135deg, #2563eb, #4f46e5)",
                                color: "white",
                                padding: "35px",
                                borderRadius: "22px",
                                marginBottom: "30px",
                                boxSizing: "border-box",
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "20px",
                                    flexWrap: "wrap",
                                }}
                            >

                                <div>

                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: "28px",
                                        }}
                                    >
                                        Overall Progress
                                    </h2>

                                    <p
                                        style={{
                                            margin: "10px 0 0",
                                            fontSize: "16px",
                                            opacity: 0.9,
                                        }}
                                    >
                                        Keep learning, keep improving!
                                    </p>

                                </div>

                                <div
                                    style={{
                                        fontSize: "52px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {overallProgress}%
                                </div>

                            </div>

                            <div
                                style={{
                                    marginTop: "25px",
                                    height: "14px",
                                    background: "rgba(255,255,255,0.3)",
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                }}
                            >

                                <div
                                    style={{
                                        width: `${overallProgress}%`,
                                        height: "100%",
                                        background: "white",
                                        borderRadius: "20px",
                                        transition: "width 0.6s ease",
                                    }}
                                />

                            </div>

                        </section>

                        {/* ================= LEVEL ================= */}

                        <section
                            style={{
                                background: "#ffffff",
                                padding: "28px",
                                borderRadius: "20px",
                                marginBottom: "30px",
                                boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
                                textAlign: "center",
                            }}
                        >

                            <div style={{ fontSize: "42px" }}>
                                🏆
                            </div>

                            <h2
                                style={{
                                    margin: "10px 0",
                                    color: "#2563eb",
                                }}
                            >
                                {getLevel()} Learner
                            </h2>

                            <p
                                style={{
                                    color: "#64748b",
                                    fontSize: "16px",
                                    margin: 0,
                                }}
                            >
                                {getMessage()}
                            </p>

                        </section>

                        {/* ================= SKILLS ================= */}

                        <h2
                            style={{
                                textAlign: "center",
                                marginBottom: "25px",
                            }}
                        >
                            📚 Skill Progress
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(240px, 1fr))",
                                gap: "22px",
                                marginBottom: "35px",
                            }}
                        >

                            <SkillCard
                                icon="📖"
                                title="Vocabulary"
                                completed={`${progress.vocabulary_completed} activities`}
                                percentage={vocabularyProgress}
                            />

                            <SkillCard
                                icon="✍️"
                                title="Grammar"
                                completed={`${progress.grammar_completed} activities`}
                                percentage={grammarProgress}
                            />

                            <SkillCard
                                icon="📝"
                                title="AI Quiz"
                                completed="Latest score"
                                percentage={progress.quiz_score}
                            />

                            <SkillCard
                                icon="🎤"
                                title="Speaking"
                                completed={`${progress.pronunciation_completed} practices`}
                                percentage={speakingProgress}
                            />

                        </div>

                        {/* ================= SUMMARY ================= */}

                        <section
                            style={{
                                background: "#ffffff",
                                padding: "30px",
                                borderRadius: "20px",
                                marginBottom: "35px",
                                boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
                            }}
                        >

                            <h2
                                style={{
                                    marginTop: 0,
                                    textAlign: "center",
                                }}
                            >
                                📈 Learning Summary
                            </h2>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(180px, 1fr))",
                                    gap: "20px",
                                    marginTop: "25px",
                                    textAlign: "center",
                                }}
                            >

                                <SummaryItem
                                    number={progress.vocabulary_completed}
                                    label="Vocabulary Activities"
                                />

                                <SummaryItem
                                    number={progress.grammar_completed}
                                    label="Grammar Activities"
                                />

                                <SummaryItem
                                    number={progress.pronunciation_completed}
                                    label="Speaking Practices"
                                />

                                <SummaryItem
                                    number={`${progress.quiz_score}%`}
                                    label="Quiz Score"
                                />

                            </div>

                        </section>

                        {/* ================= BUTTONS ================= */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "15px",
                                flexWrap: "wrap",
                            }}
                        >

                            <button
                                onClick={goDashboard}
                                style={{
                                    padding: "13px 28px",
                                    border: "none",
                                    borderRadius: "10px",
                                    background: "#2563eb",
                                    color: "white",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                ← Back to Dashboard
                            </button>

                            <button
                                onClick={fetchProgress}
                                style={{
                                    padding: "13px 28px",
                                    border: "none",
                                    borderRadius: "10px",
                                    background: "#0f766e",
                                    color: "white",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                🔄 Refresh Progress
                            </button>

                        </div>

                    </>

                )}

            </main>

        </div>
    );
}


/* ================= SKILL CARD ================= */

function SkillCard({
    icon,
    title,
    completed,
    percentage,
}) {
    return (
        <div
            style={{
                background: "#ffffff",
                padding: "25px",
                borderRadius: "18px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
            }}
        >

            <div style={{ fontSize: "40px" }}>
                {icon}
            </div>

            <h3
                style={{
                    margin: "12px 0 7px",
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    color: "#64748b",
                    margin: "0 0 18px",
                }}
            >
                {completed}
            </p>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    fontWeight: "bold",
                }}
            >

                <span>Progress</span>

                <span style={{ color: "#2563eb" }}>
                    {percentage}%
                </span>

            </div>

            <div
                style={{
                    height: "9px",
                    background: "#e2e8f0",
                    borderRadius: "20px",
                    overflow: "hidden",
                }}
            >

                <div
                    style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background: "#2563eb",
                        borderRadius: "20px",
                        transition: "width 0.5s ease",
                    }}
                />

            </div>

        </div>
    );
}


/* ================= SUMMARY ITEM ================= */

function SummaryItem({
    number,
    label,
}) {
    return (
        <div
            style={{
                padding: "20px",
                background: "#f8fafc",
                borderRadius: "14px",
            }}
        >

            <div
                style={{
                    fontSize: "30px",
                    fontWeight: "bold",
                    color: "#2563eb",
                }}
            >
                {number}
            </div>

            <p
                style={{
                    margin: "8px 0 0",
                    color: "#64748b",
                    fontSize: "14px",
                }}
            >
                {label}
            </p>

        </div>
    );
}

export default Progress;