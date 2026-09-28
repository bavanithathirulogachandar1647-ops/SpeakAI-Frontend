import { useState } from "react";

function Translation() {
    const [fromLanguage, setFromLanguage] = useState("English");
    const [toLanguage, setToLanguage] = useState("Tamil");
    const [text, setText] = useState("");
    const [translation, setTranslation] = useState("");
    const [loading, setLoading] = useState(false);

    const translateText = async () => {
        if (text.trim() === "") {
            alert("Please enter text to translate.");
            return;
        }

        setLoading(true);
        setTranslation("");

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/translate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: text,
                        from_language: fromLanguage,
                        to_language: toLanguage
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setTranslation(data.translation);
            } else {
                setTranslation(data.message || "Translation failed.");
            }

        } catch (error) {
            setTranslation(
                "Cannot connect to the server. Please make sure Flask is running."
            );
        }

        setLoading(false);
    };

    return (
        <div>
            <h1>🇮🇳 Tamil Translation</h1>

            <h3>From Language</h3>

            <select
                value={fromLanguage}
                onChange={(event) =>
                    setFromLanguage(event.target.value)
                }
            >
                <option value="English">🇬🇧 English</option>
                <option value="Tamil">🇮🇳 Tamil</option>
                <option value="French">🇫🇷 French</option>
                <option value="German">🇩🇪 German</option>
                <option value="Spanish">🇪🇸 Spanish</option>
            </select>

            <h3>To Language</h3>

            <select
                value={toLanguage}
                onChange={(event) =>
                    setToLanguage(event.target.value)
                }
            >
                <option value="Tamil">🇮🇳 Tamil</option>
                <option value="English">🇬🇧 English</option>
                <option value="French">🇫🇷 French</option>
                <option value="German">🇩🇪 German</option>
                <option value="Spanish">🇪🇸 Spanish</option>
            </select>

            <br />
            <br />

            <textarea
                rows="5"
                cols="50"
                placeholder="Enter text to translate..."
                value={text}
                onChange={(event) => setText(event.target.value)}
            />

            <br />
            <br />

            <button
                onClick={translateText}
                disabled={loading}
            >
                {loading ? "Translating..." : "Translate"}
            </button>

            <hr />

            {translation && (
                <div>
                    <h3>🌐 Translation:</h3>
                    <p>{translation}</p>
                </div>
            )}

            <br />

            <button
                onClick={() => (window.location.href = "/dashboard")}
            >
                Back to Dashboard
            </button>
        </div>
    );
}

export default Translation;