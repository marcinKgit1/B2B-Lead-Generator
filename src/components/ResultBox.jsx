export function ResultBox({ email, hasError }) {
    if (!email || hasError) return null;

    return (
        <div className="result-box">
            <h3>Wygenerowany Mail:</h3>
            <div className="email-content">{email}</div>
        </div>
    );
}
