export function LeadForm({ url, onUrlChange, onSubmit, loading }) {
    return (
        <form onSubmit={onSubmit} className="form-group">
            <div className="input-wrapper">
                {/* Globe icon */}
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <input
                    type="text"
                    placeholder="np. apple.com"
                    value={url}
                    onChange={(e) => onUrlChange(e.target.value)}
                    required
                    className="url-input"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="submit-button"
            >
                {loading ? (
                    <span className="spinner-row">
                        <span className="spinner" />
                        Analizuję stronę...
                    </span>
                ) : (
                    "✨ Generuj Maila"
                )}
            </button>
        </form>
    );
}
