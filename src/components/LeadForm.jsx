export function LeadForm({ url, onUrlChange, onSubmit, loading }) {
    return (
        <form onSubmit={onSubmit} className="form-group">
            <input
                type="text"
                placeholder="np. apple.com"
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                required
                className="url-input"
            />
            <button
                type="submit"
                disabled={loading}
                className={`submit-button ${loading ? "loading" : ""}`}
            >
                {loading ? "Generowanie..." : "Generuj Maila"}
            </button>
        </form>
    );
}
