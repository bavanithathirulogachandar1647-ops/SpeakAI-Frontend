import React, { useRef, useState } from "react";

function Pronunciation() {
    const [sentence, setSentence] = useState("");
    const [recognizedText, setRecognizedText] = useState("");
    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState(null);
    const [listening, setListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const recognitionRef = useRef(null);

    // -----------------------------------------
    // START SPEAKING / MICROPHONE
    // -----------------------------------------
    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setMessage(
                "Speech recognition is not supported in this browser. Please use Google Chrome."
            );
            return;
        }

        setMessage("");
        setRecognizedText("");
        setFeedback("");
        setScore(null);

        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setListening(true);
            setMessage("Listening... Speak now 🎤");
        };

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;

            setRecognizedText(text);
            setSentence(text);
            setMessage("Speech recognized successfully ✅");
        };

        recognition.onerror = (event) => {
            console.log("Speech recognition error:", event.error);

            setListening(false);

            if (event.error === "not-allowed") {
                setMessage(
                    "Microphone permission was denied. Please allow microphone access."
                );
            } else {
                setMessage("Could not recognize your speech. Please try again.");
            }
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognitionRef.current = recognition;

        recognition.start();
    };

    // -----------------------------------------
    // STOP LISTENING
    // -----------------------------------------
    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        setListening(false);
    };

    // -----------------------------------------
    // LISTEN TO EXAMPLE SENTENCE
    // -----------------------------------------
    const listenSentence = () => {
        if (!sentence.trim()) {
            setMessage("Please enter a sentence first.");
            return;
        }

        const speech = new SpeechSynthesisUtterance(sentence);

        speech.lang = "en-US";
        speech.rate = 0.9;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
    };

    // -----------------------------------------
    // GET AI FEEDBACK
    // -----------------------------------------
    const getAIFeedback = async () => {
        if (!recognizedText.trim()) {
            setMessage("Please speak a sentence first.");
            return;
        }

        const userId = localStorage.getItem("user_id");

        if (!userId) {
            setMessage("Please login again.");
            return;
        }

        setLoading(true);
        setFeedback("");
        setScore(null);
        setMessage("AI is checking your speaking practice... 🤖");

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/speaking-practice",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        text: recognizedText,
                        user_id: Number(userId),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Something went wrong"
                );
            }

            setFeedback(data.feedback || "No feedback received.");

            setScore(
                typeof data.score === "number"
                    ? data.score
                    : null
            );

            setMessage(
                "Speaking practice completed and progress saved ✅"
            );
        } catch (error) {
            console.error("Speaking practice error:", error);

            setMessage(
                error.message ||
                "Unable to connect to the AI. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------
    // EXAMPLE SENTENCES
    // -----------------------------------------
    const examples = [
        "I am learning English every day.",
        "I want to improve my speaking skills.",
        "Today is a beautiful day.",
        "I enjoy learning new words.",
    ];

    const chooseExample = (text) => {
        setSentence(text);
        setRecognizedText("");
        setFeedback("");
        setScore(null);
        setMessage("");
    };

    // -----------------------------------------
    // PAGE UI
    // -----------------------------------------
    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #eef5ff, #f8fbff)",
                fontFamily:
                    "Arial, Helvetica, sans-serif",
                paddingBottom: "50px",
            }}
        >
            {/* HEADER */}
            <div
                style={{
                    background: "#ffffff",
                    borderBottom: "1px solid #e5e7eb",
                    padding: "18px 7%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                }}
            >
                <div>
                    <h2
                        style={{
                            margin: 0,
                            color: "#2563eb",
                            fontSize: "25px",
                        }}
                    >
                        SpeakAI
                    </h2>

                    <p
                        style={{
                            margin: "4px 0 0",
                            color: "#6b7280",
                            fontSize: "13px",
                        }}
                    >
                        AI Speaking Practice
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={() => {
                            window.location.href = "/dashboard";
                        }}
                        style={{
                            border: "1px solid #dbe3ef",
                            background: "#ffffff",
                            padding: "10px 18px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "600",
                        }}
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem("user_id");
                            localStorage.removeItem("user_name");
                            localStorage.removeItem("user_email");

                            window.location.href = "/";
                        }}
                        style={{
                            border: "none",
                            background: "#ef4444",
                            color: "#ffffff",
                            padding: "10px 18px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "600",
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div
                style={{
                    maxWidth: "1000px",
                    margin: "40px auto",
                    padding: "0 20px",
                }}
            >
                {/* TITLE */}
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "30px",
                    }}
                >
                    <h1
                        style={{
                            marginBottom: "10px",
                            color: "#111827",
                            fontSize: "34px",
                        }}
                    >
                        🎤 Speaking Practice
                    </h1>

                    <p
                        style={{
                            color: "#6b7280",
                            fontSize: "16px",
                        }}
                    >
                        Speak in English and get AI-powered feedback.
                    </p>
                </div>

                {/* PRACTICE CARD */}
                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: "20px",
                        padding: "30px",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.08)",
                        marginBottom: "25px",
                    }}
                >
                    <h3
                        style={{
                            color: "#111827",
                            marginTop: 0,
                        }}
                    >
                        Practice Sentence
                    </h3>

                    <textarea
                        value={sentence}
                        onChange={(e) => {
                            setSentence(e.target.value);
                            setRecognizedText("");
                            setFeedback("");
                            setScore(null);
                        }}
                        placeholder="Enter a sentence or use the microphone..."
                        rows="4"
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "15px",
                            borderRadius: "12px",
                            border: "1px solid #d1d5db",
                            fontSize: "16px",
                            outline: "none",
                            resize: "vertical",
                        }}
                    />

                    {/* BUTTONS */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "12px",
                            marginTop: "18px",
                        }}
                    >
                        {!listening ? (
                            <button
                                onClick={startListening}
                                style={{
                                    background: "#2563eb",
                                    color: "#ffffff",
                                    border: "none",
                                    padding: "13px 22px",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    fontSize: "15px",
                                }}
                            >
                                🎤 Start Speaking
                            </button>
                        ) : (
                            <button
                                onClick={stopListening}
                                style={{
                                    background: "#ef4444",
                                    color: "#ffffff",
                                    border: "none",
                                    padding: "13px 22px",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    fontSize: "15px",
                                }}
                            >
                                ⏹ Stop Listening
                            </button>
                        )}

                        <button
                            onClick={listenSentence}
                            style={{
                                background: "#f3f4f6",
                                color: "#111827",
                                border: "1px solid #d1d5db",
                                padding: "13px 22px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "15px",
                            }}
                        >
                            🔊 Listen
                        </button>

                        <button
                            onClick={getAIFeedback}
                            disabled={loading}
                            style={{
                                background: loading
                                    ? "#93c5fd"
                                    : "#16a34a",
                                color: "#ffffff",
                                border: "none",
                                padding: "13px 22px",
                                borderRadius: "10px",
                                cursor: loading
                                    ? "not-allowed"
                                    : "pointer",
                                fontWeight: "600",
                                fontSize: "15px",
                            }}
                        >
                            {loading
                                ? "Checking..."
                                : "🤖 Get AI Feedback"}
                        </button>
                    </div>

                    {/* STATUS MESSAGE */}
                    {message && (
                        <div
                            style={{
                                marginTop: "18px",
                                padding: "12px 15px",
                                borderRadius: "10px",
                                background: "#eff6ff",
                                color: "#1d4ed8",
                                fontSize: "14px",
                            }}
                        >
                            {message}
                        </div>
                    )}
                </div>

                {/* RECOGNIZED SPEECH */}
                {recognizedText && (
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "20px",
                            padding: "25px",
                            boxShadow:
                                "0 8px 25px rgba(0,0,0,0.06)",
                            marginBottom: "25px",
                        }}
                    >
                        <h3
                            style={{
                                marginTop: 0,
                                color: "#111827",
                            }}
                        >
                            🗣️ Recognized Speech
                        </h3>

                        <p
                            style={{
                                background: "#f9fafb",
                                padding: "15px",
                                borderRadius: "10px",
                                color: "#374151",
                                lineHeight: "1.6",
                            }}
                        >
                            {recognizedText}
                        </p>
                    </div>
                )}

                {/* SCORE */}
                {score !== null && (
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "20px",
                            padding: "30px",
                            textAlign: "center",
                            boxShadow:
                                "0 8px 25px rgba(0,0,0,0.06)",
                            marginBottom: "25px",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                color: "#6b7280",
                                fontSize: "15px",
                            }}
                        >
                            Your Speaking Score
                        </p>

                        <div
                            style={{
                                fontSize: "58px",
                                fontWeight: "bold",
                                color: "#2563eb",
                                margin: "10px 0",
                            }}
                        >
                            {score}
                            <span
                                style={{
                                    fontSize: "25px",
                                    color: "#6b7280",
                                }}
                            >
                                /10
                            </span>
                        </div>

                        <p
                            style={{
                                margin: 0,
                                color: "#16a34a",
                                fontWeight: "600",
                            }}
                        >
                            Great job! Keep practicing 🚀
                        </p>
                    </div>
                )}

                {/* AI FEEDBACK */}
                {feedback && (
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "20px",
                            padding: "30px",
                            boxShadow:
                                "0 8px 25px rgba(0,0,0,0.06)",
                            marginBottom: "25px",
                        }}
                    >
                        <h3
                            style={{
                                marginTop: 0,
                                color: "#111827",
                            }}
                        >
                            🤖 AI Feedback
                        </h3>

                        <div
                            style={{
                                whiteSpace: "pre-wrap",
                                color: "#374151",
                                lineHeight: "1.7",
                                fontSize: "15px",
                                background: "#f9fafb",
                                padding: "20px",
                                borderRadius: "12px",
                            }}
                        >
                            {feedback}
                        </div>
                    </div>
                )}

                {/* EXAMPLES */}
                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: "20px",
                        padding: "30px",
                        boxShadow:
                            "0 8px 25px rgba(0,0,0,0.06)",
                    }}
                >
                    <h3
                        style={{
                            marginTop: 0,
                            color: "#111827",
                        }}
                    >
                        💡 Practice Sentences
                    </h3>

                    <p
                        style={{
                            color: "#6b7280",
                            fontSize: "14px",
                        }}
                    >
                        Choose a sentence and practice speaking it.
                    </p>

                    <div
                        style={{
                            display: "grid",
                            gap: "12px",
                        }}
                    >
                        {examples.map((example, index) => (
                            <button
                                key={index}
                                onClick={() => chooseExample(example)}
                                style={{
                                    textAlign: "left",
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    padding: "15px",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    color: "#334155",
                                    fontSize: "15px",
                                }}
                            >
                                {example}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TIPS */}
                <div
                    style={{
                        marginTop: "25px",
                        background: "#eff6ff",
                        borderRadius: "20px",
                        padding: "25px",
                    }}
                >
                    <h3
                        style={{
                            marginTop: 0,
                            color: "#1e40af",
                        }}
                    >
                        📌 Speaking Tips
                    </h3>

                    <ul
                        style={{
                            color: "#374151",
                            lineHeight: "1.8",
                            paddingLeft: "22px",
                        }}
                    >
                        <li>Speak slowly and clearly.</li>
                        <li>Use complete sentences.</li>
                        <li>Practice every day.</li>
                        <li>Listen to the example before speaking.</li>
                        <li>Use AI feedback to improve your English.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Pronunciation;