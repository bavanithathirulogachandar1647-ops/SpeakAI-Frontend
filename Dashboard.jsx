import { useEffect, useState } from "react";

function Dashboard() {
    const userId = localStorage.getItem("user_id");
    const userName = localStorage.getItem("user_name");
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
        const fetchProgress = async () => {
            if (!userId || !token) {
                setLoading(false);
                return;
            }

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

                console.log("DASHBOARD PROGRESS:", data);

                if (!response.ok) {
                    throw new Error(data.error || "Unable to get progress");
                }

                setProgress({
                    vocabulary_completed: data.vocabulary_completed || 0,
                    grammar_completed: data.grammar_completed || 0,
                    quiz_score: data.quiz_score || 0,
                    pronunciation_completed:
                        data.pronunciation_completed || 0,
                });

            } catch (err) {
                console.error("DASHBOARD ERROR:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [userId, token]);

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

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_email");

        window.location.href = "/";
    };

    const openFeature = (path) => {
        window.location.href = path;
    };

    return (
        <div style={styles.page}>

            {/* Header */}
            <header style={styles.header}>
                <div>
                    <h1 style={styles.logo}>🌐 SpeakAI</h1>
                    <p style={styles.tagline}>
                        AI-Powered Language Learning Platform
                    </p>
                </div>

                <button onClick={logout} style={styles.logoutButton}>
                    Logout
                </button>
            </header>

            {/* Welcome */}
            <section style={styles.welcome}>
                <h2>
                    Welcome, {userName || "Learner"} 👋
                </h2>

                <p>
                    Continue your English learning journey with SpeakAI.
                </p>
            </section>

            {/* Error */}
            {error && (
                <div style={styles.error}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div style={styles.loading}>
                    Loading your progress...
                </div>
            ) : (
                <>
                    {/* Overall Progress */}
                    <section style={styles.overallCard}>
                        <div>
                            <h2>📊 Overall Learning Progress</h2>

                            <p style={styles.progressText}>
                                {overallProgress}% completed
                            </p>

                            <div style={styles.progressBarBackground}>
                                <div
                                    style={{
                                        ...styles.progressBar,
                                        width: `${overallProgress}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div style={styles.progressCircle}>
                            {overallProgress}%
                        </div>
                    </section>

                    {/* Features */}
                    <h2 style={styles.sectionTitle}>
                        🚀 Learning Features
                    </h2>

                    <div style={styles.featureGrid}>

                        <FeatureCard
                            icon="🇬🇧"
                            title="English Learning"
                            description="Improve your English skills step by step."
                            button="Start Learning"
                            onClick={() => openFeature("/vocabulary")}
                        />

                        <FeatureCard
                            icon="🇮🇳"
                            title="Tamil Translation"
                            description="Translate Tamil and English using AI."
                            button="Translate"
                            onClick={() => openFeature("/translation")}
                        />

                        <FeatureCard
                            icon="🤖"
                            title="AI Conversation"
                            description="Practice conversations with your AI tutor."
                            button="Start Conversation"
                            onClick={() => openFeature("/ai-tutor")}
                        />

                        <FeatureCard
                            icon="✍️"
                            title="Grammar Correction"
                            description="Check and improve your English grammar."
                            button="Check Grammar"
                            onClick={() => openFeature("/grammar")}
                        />

                        <FeatureCard
                            icon="📖"
                            title="Vocabulary"
                            description="Learn useful English words and meanings."
                            button="Learn Words"
                            onClick={() => openFeature("/vocabulary")}
                        />

                        <FeatureCard
                            icon="📝"
                            title="AI Quiz"
                            description="Test your English knowledge with AI-generated quizzes."
                            button="Take Quiz"
                            onClick={() => openFeature("/ai-quiz")}
                        />

                        <FeatureCard
                            icon="🎤"
                            title="Speaking Practice"
                            description="Practice pronunciation and speaking skills."
                            button="Practice Now"
                            onClick={() => openFeature("/pronunciation")}
                        />

                        <FeatureCard
                            icon="📊"
                            title="Progress Tracking"
                            description="View your learning progress and achievements."
                            button="View Progress"
                            onClick={() => openFeature("/progress")}
                        />

                    </div>

                    {/* Progress Summary */}
                    <section style={styles.summaryCard}>
                        <h2>📈 Your Learning Summary</h2>

                        <div style={styles.summaryGrid}>

                            <SummaryItem
                                title="Vocabulary"
                                value={`${vocabularyProgress}%`}
                            />

                            <SummaryItem
                                title="Grammar"
                                value={`${grammarProgress}%`}
                            />

                            <SummaryItem
                                title="Quiz Score"
                                value={`${progress.quiz_score}%`}
                            />

                            <SummaryItem
                                title="Speaking"
                                value={`${speakingProgress}%`}
                            />

                        </div>
                    </section>

                    {/* Progress Button */}
                    <div style={styles.bottomSection}>
                        <button
                            onClick={() => openFeature("/progress")}
                            style={styles.progressButton}
                        >
                            📊 View Detailed Progress
                        </button>
                    </div>

                </>
            )}

            <footer style={styles.footer}>
                <p>
                    © 2026 SpeakAI • AI-Powered Language Learning
                </p>
            </footer>

        </div>
    );
}


/* Feature Card */

function FeatureCard({
    icon,
    title,
    description,
    button,
    onClick,
}) {
    return (
        <div style={styles.featureCard}>

            <div style={styles.featureIcon}>
                {icon}
            </div>

            <h3>{title}</h3>

            <p style={styles.featureDescription}>
                {description}
            </p>

            <button
                onClick={onClick}
                style={styles.featureButton}
            >
                {button}
            </button>

        </div>
    );
}


/* Summary Item */

function SummaryItem({ title, value }) {
    return (
        <div style={styles.summaryItem}>
            <h3>{value}</h3>
            <p>{title}</p>
        </div>
    );
}


/* Styles */

const styles = {
    page: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #eef2ff, #f8fafc)",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "40px",
    },

    header: {
        background: "#ffffff",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
    },

    logo: {
        margin: 0,
        fontSize: "30px",
        color: "#4f46e5",
    },

    tagline: {
        margin: "5px 0 0",
        color: "#64748b",
        fontSize: "14px",
    },

    logoutButton: {
        background: "#ef4444",
        color: "#ffffff",
        border: "none",
        padding: "11px 20px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold",
    },

    welcome: {
        maxWidth: "1100px",
        margin: "35px auto 20px",
        padding: "0 20px",
    },

    welcomeTitle: {
        fontSize: "28px",
    },

    welcomeText: {
        color: "#64748b",
    },

    overallCard: {
        maxWidth: "1060px",
        margin: "25px auto",
        padding: "30px",
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "30px",
    },

    progressText: {
        color: "#4f46e5",
        fontWeight: "bold",
        fontSize: "20px",
    },

    progressBarBackground: {
        width: "600px",
        maxWidth: "100%",
        height: "14px",
        background: "#e2e8f0",
        borderRadius: "20px",
        overflow: "hidden",
    },

    progressBar: {
        height: "100%",
        background: "#4f46e5",
        borderRadius: "20px",
        transition: "width 0.5s ease",
    },

    progressCircle: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        background: "#eef2ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#4f46e5",
        fontWeight: "bold",
        fontSize: "22px",
    },

    sectionTitle: {
        maxWidth: "1100px",
        margin: "35px auto 20px",
        padding: "0 20px",
    },

    featureGrid: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 20px",
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
    },

    featureCard: {
        background: "#ffffff",
        padding: "25px",
        borderRadius: "18px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
        textAlign: "center",
        transition: "transform 0.2s",
    },

    featureIcon: {
        fontSize: "42px",
        marginBottom: "10px",
    },

    featureDescription: {
        color: "#64748b",
        minHeight: "45px",
        lineHeight: "1.5",
    },

    featureButton: {
        marginTop: "15px",
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "10px",
        background: "#4f46e5",
        color: "#ffffff",
        fontWeight: "bold",
        cursor: "pointer",
    },

    summaryCard: {
        maxWidth: "1060px",
        margin: "35px auto",
        padding: "30px",
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    },

    summaryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "15px",
        marginTop: "20px",
    },

    summaryItem: {
        background: "#f8fafc",
        padding: "20px",
        borderRadius: "15px",
        textAlign: "center",
    },

    summaryValue: {
        fontSize: "26px",
        color: "#4f46e5",
    },

    bottomSection: {
        textAlign: "center",
        marginTop: "30px",
    },

    progressButton: {
        padding: "14px 25px",
        border: "none",
        borderRadius: "12px",
        background: "#4f46e5",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "16px",
        cursor: "pointer",
    },

    loading: {
        textAlign: "center",
        marginTop: "60px",
        fontSize: "18px",
        color: "#64748b",
    },

    error: {
        maxWidth: "1060px",
        margin: "20px auto",
        padding: "15px 20px",
        background: "#fee2e2",
        color: "#991b1b",
        borderRadius: "10px",
    },

    footer: {
        textAlign: "center",
        marginTop: "50px",
        color: "#64748b",
        fontSize: "14px",
    },
};

export default Dashboard;