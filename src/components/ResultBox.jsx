import { useState } from "react";

export function ResultBox({ email, hasError }) {
    const [copied, setCopied] = useState(false);

    if (!email || hasError) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(email).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="result-box">
            <div className="result-header">
                <h3>Wygenerowany Mail</h3>
                <button
                    className={`copy-button ${copied ? "copied" : ""}`}
                    onClick={handleCopy}
                    type="button"
                >
                    {copied ? (
                        <>
                            {/* Check icon */}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Skopiowano!
                        </>
                    ) : (
                        <>
                            {/* Copy icon */}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            Kopiuj
                        </>
                    )}
                </button>
            </div>

            <div className="email-content">{email}</div>

            <div className="char-count">
                {email.length} znaków
            </div>
        </div>
    );
}
