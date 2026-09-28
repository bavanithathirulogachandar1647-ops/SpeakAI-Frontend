import { useState } from "react";

function AITutor() {
    const userName = localStorage.getItem("user_name") || "Learner";

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: `Hello ${userName}! 👋 I'm your AI English Tutor. How can I help you today?`,
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        const question = input.trim();

        if (!question || loading) {
            return;
        }

        // Add user's message
        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: question,
            },
        ]);

        setInput("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/ai-tutor",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        question: question,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            const aiReply =
                data.response ||
                data.reply ||
                data.answer ||
                "Sorry, I couldn't generate a response.";

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: aiReply,
                },
            ]);
        } catch (error) {
            console.error("AI Tutor Error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: "Sorry, something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const goDashboard = () => {
        window.location.href = "/dashboard";
    };

    const logout = () => {
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_email");

        window.location.href = "/";
    };

    return (
        <div style={styles.page}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.logoSection}>
                    <div style={styles.logo}>S</div>

                    <div>
                        <div style={styles.brand}>SpeakAI</div>
                        <div style={styles.subtitle}>AI Language Learning</div>
                    </div>
                </div>

                <div style={styles.headerRight}>
                    <span style={styles.userName}>{userName}</span>

                    <button
                        style={styles.dashboardButton}
                        onClick={goDashboard}
                    >
                        Dashboard
                    </button>

                    <button
                        style={styles.logoutButton}
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main */}
            <main style={styles.main}>
                <div style={styles.titleSection}>
                    <h1 style={styles.title}>AI Conversation</h1>

                    <p style={styles.description}>
                        Practice English naturally with your personal AI tutor.
                    </p>
                </div>

                {/* Chat Box */}
                <div style={styles.chatContainer}>
                    <div style={styles.chatHeader}>
                        <div style={styles.tutorInfo}>
                            <div style={styles.aiIcon}>AI</div>

                            <div>
                                <div style={styles.tutorName}>SpeakAI Tutor</div>
                                <div style={styles.online}>
                                    <span style={styles.onlineDot}></span>
                                    Online
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={styles.messagesArea}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                style={{
                                    ...styles.messageRow,
                                    justifyContent:
                                        message.sender === "user"
                                            ? "flex-end"
                                            : "flex-start",
                                }}
                            >
                                {message.sender === "ai" && (
                                    <div style={styles.smallAiIcon}>AI</div>
                                )}

                                <div
                                    style={{
                                        ...styles.messageBubble,
                                        ...(message.sender === "user"
                                            ? styles.userBubble
                                            : styles.aiBubble),
                                    }}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}

                        {/* Loading */}
                        {loading && (
                            <div style={styles.messageRow}>
                                <div style={styles.smallAiIcon}>AI</div>

                                <div style={styles.aiBubble}>
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div style={styles.inputSection}>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message in English..."
                            rows="1"
                            disabled={loading}
                            style={styles.input}
                        />

                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            style={{
                                ...styles.sendButton,
                                opacity:
                                    loading || !input.trim() ? 0.5 : 1,
                                cursor:
                                    loading || !input.trim()
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            {loading ? "..." : "Send"}
                        </button>
                    </div>

                    <div style={styles.tip}>
                        Press <strong>Enter</strong> to send
                    </div>
                </div>

                {/* Suggestions */}
                <div style={styles.suggestions}>
                    <div style={styles.suggestionTitle}>
                        Try asking:
                    </div>

                    <div style={styles.suggestionButtons}>
                        <button
                            style={styles.suggestionButton}
                            onClick={() =>
                                setInput("Can you help me practice English?")
                            }
                        >
                            Practice English
                        </button>

                        <button
                            style={styles.suggestionButton}
                            onClick={() =>
                                setInput("How can I improve my English vocabulary?")
                            }
                        >
                            Improve vocabulary
                        </button>

                        <button
                            style={styles.suggestionButton}
                            onClick={() =>
                                setInput("Can you correct my English sentence?")
                            }
                        >
                            Correct my sentence
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#172033",
    },

    header: {
        height: "72px",
        background: "#ffffff",
        borderBottom: "1px solid #e7eaf0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        boxSizing: "border-box",
    },

    logoSection: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },

    logo: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: "#2563eb",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        fontWeight: "700",
    },

    brand: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#111827",
    },

    subtitle: {
        fontSize: "11px",
        color: "#7b8494",
        marginTop: "1px",
    },

    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },

    userName: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
        marginRight: "8px",
    },

    dashboardButton: {
        border: "1px solid #d9dee8",
        background: "#ffffff",
        color: "#374151",
        padding: "9px 15px",
        borderRadius: "8px",
        fontSize: "13px",
        cursor: "pointer",
    },

    logoutButton: {
        border: "none",
        background: "#111827",
        color: "#ffffff",
        padding: "9px 15px",
        borderRadius: "8px",
        fontSize: "13px",
        cursor: "pointer",
    },

    main: {
        maxWidth: "900px",
        margin: "0 auto",
        padding: "45px 20px 60px",
        boxSizing: "border-box",
    },

    titleSection: {
        marginBottom: "25px",
    },

    title: {
        margin: "0 0 8px",
        fontSize: "30px",
        fontWeight: "700",
        color: "#111827",
    },

    description: {
        margin: 0,
        color: "#6b7280",
        fontSize: "15px",
    },

    chatContainer: {
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
    },

    chatHeader: {
        padding: "17px 20px",
        borderBottom: "1px solid #edf0f4",
    },

    tutorInfo: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },

    aiIcon: {
        width: "42px",
        height: "42px",
        borderRadius: "12px",
        background: "#eff6ff",
        color: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: "13px",
    },

    tutorName: {
        fontSize: "15px",
        fontWeight: "700",
        color: "#1f2937",
    },

    online: {
        marginTop: "3px",
        fontSize: "12px",
        color: "#6b7280",
        display: "flex",
        alignItems: "center",
        gap: "5px",
    },

    onlineDot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: "#22c55e",
        display: "inline-block",
    },

    messagesArea: {
        minHeight: "420px",
        maxHeight: "500px",
        overflowY: "auto",
        padding: "25px 20px",
        background: "#fbfcfe",
    },

    messageRow: {
        display: "flex",
        alignItems: "flex-end",
        gap: "9px",
        marginBottom: "16px",
    },

    smallAiIcon: {
        width: "28px",
        height: "28px",
        borderRadius: "8px",
        background: "#eff6ff",
        color: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "9px",
        fontWeight: "700",
        flexShrink: 0,
    },

    messageBubble: {
        maxWidth: "70%",
        padding: "12px 15px",
        borderRadius: "14px",
        fontSize: "14px",
        lineHeight: "1.5",
        whiteSpace: "pre-wrap",
    },

    aiBubble: {
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        color: "#374151",
        borderBottomLeftRadius: "4px",
    },

    userBubble: {
        background: "#2563eb",
        color: "#ffffff",
        borderBottomRightRadius: "4px",
    },

    inputSection: {
        display: "flex",
        gap: "10px",
        padding: "15px 18px 8px",
        borderTop: "1px solid #edf0f4",
        background: "#ffffff",
    },

    input: {
        flex: 1,
        resize: "none",
        border: "1px solid #d9dee8",
        borderRadius: "10px",
        padding: "12px 13px",
        outline: "none",
        fontSize: "14px",
        fontFamily: "inherit",
        color: "#1f2937",
        boxSizing: "border-box",
    },

    sendButton: {
        alignSelf: "stretch",
        minWidth: "80px",
        border: "none",
        borderRadius: "10px",
        background: "#2563eb",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "600",
        padding: "0 18px",
    },

    tip: {
        padding: "0 18px 13px",
        background: "#ffffff",
        color: "#9ca3af",
        fontSize: "11px",
        textAlign: "right",
    },

    suggestions: {
        marginTop: "22px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "18px",
    },

    suggestionTitle: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#4b5563",
        marginBottom: "12px",
    },

    suggestionButtons: {
        display: "flex",
        flexWrap: "wrap",
        gap: "9px",
    },

    suggestionButton: {
        border: "1px solid #dce2eb",
        background: "#f8fafc",
        color: "#374151",
        padding: "9px 12px",
        borderRadius: "8px",
        fontSize: "12px",
        cursor: "pointer",
    },
};

export default AITutor;