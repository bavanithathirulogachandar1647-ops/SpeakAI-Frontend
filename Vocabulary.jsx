import { useEffect, useState } from "react";

function Vocabulary() {
    const [words, setWords] = useState([
        {
            word: "Improve",
            meaning: "To make something better",
            example: "I want to improve my English."
        },
        {
            word: "Confident",
            meaning: "Feeling sure about yourself",
            example: "She is confident when speaking English."
        },
        {
            word: "Achieve",
            meaning: "To successfully reach a goal",
            example: "I want to achieve my career goals."
        },
        {
            word: "Opportunity",
            meaning: "A good chance to do something",
            example: "This job is a great opportunity."
        },
        {
            word: "Practice",
            meaning: "To do something repeatedly to improve",
            example: "Practice English every day."
        }
    ]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [message, setMessage] = useState("");

    const currentWord = words[currentIndex];

    const completeVocabulary = async () => {
        try {
            const userId = localStorage.getItem("user_id");
            const token = localStorage.getItem("access_token");

            if (!userId || !token) {
                setMessage("Please login again.");
                return;
            }

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

            const progress = await response.json();

            if (!response.ok) {
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
                            Number(progress.vocabulary_completed || 0) + 1,
                        grammar_completed:
                            Number(progress.grammar_completed || 0),
                        quiz_score:
                            Number(progress.quiz_score || 0),
                        pronunciation_completed:
                            Number(progress.pronunciation_completed || 0),
                    }),
                }
            );

            const result = await updateResponse.json();

            if (!updateResponse.ok) {
                throw new Error(
                    result.error || "Unable to update progress"
                );
            }

            setCompleted(true);
            setMessage("Vocabulary activity completed! 🎉");

        } catch (error) {
            console.error("VOCABULARY PROGRESS ERROR:", error);
            setMessage(error.message);
        }
    };

    const nextWord = () => {
        setMessage("");
        setCompleted(false);

        if (currentIndex < words.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setMessage("You completed all vocabulary words! 🎉");
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
                    📖 Vocabulary
                </h1>

                <p style={styles.subtitle}>
                    Learn useful English words and improve your vocabulary.
                </p>

                <div style={styles.wordCard}>

                    <div style={styles.wordNumber}>
                        Word {currentIndex + 1} of {words.length}
                    </div>

                    <h2 style={styles.word}>
                        {currentWord.word}
                    </h2>

                    <p style={styles.meaning}>
                        <strong>Meaning:</strong>{" "}
                        {currentWord.meaning}
                    </p>

                    <p style={styles.example}>
                        <strong>Example:</strong>{" "}
                        {currentWord.example}
                    </p>

                </div>

                {!completed ? (
                    <button
                        onClick={completeVocabulary}
                        style={styles.completeButton}
                    >
                        Mark as Completed ✓
                    </button>
                ) : (
                    <button
                        onClick={nextWord}
                        style={styles.nextButton}
                    >
                        Next Word →
                    </button>
                )}

                {message && (
                    <div style={styles.message}>
                        {message}
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
        maxWidth: "800px",
        margin: "0 auto",
        background: "#ffffff",
        padding: "35px",
        borderRadius: "20px",
        boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
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
        marginBottom: "30px",
    },

    wordCard: {
        padding: "30px",
        borderRadius: "18px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        marginBottom: "25px",
    },

    wordNumber: {
        color: "#64748b",
        fontSize: "14px",
        marginBottom: "15px",
    },

    word: {
        fontSize: "36px",
        color: "#4f46e5",
        marginBottom: "20px",
    },

    meaning: {
        fontSize: "17px",
        lineHeight: "1.6",
    },

    example: {
        fontSize: "16px",
        lineHeight: "1.6",
        color: "#475569",
    },

    completeButton: {
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

    nextButton: {
        width: "100%",
        padding: "14px",
        border: "none",
        borderRadius: "12px",
        background: "#16a34a",
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
    },

    message: {
        marginTop: "20px",
        padding: "15px",
        borderRadius: "10px",
        background: "#eef2ff",
        color: "#3730a3",
        textAlign: "center",
    },
};

export default Vocabulary;