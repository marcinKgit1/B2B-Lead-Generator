import { useState } from "react";
import "./App.css"; // Importujemy zewnętrzne style

function App() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Nowy stan na zarządzanie błędami

  const generateLead = async (e) => {
    e.preventDefault();

    // Resetujemy stany przed nowym zapytaniem
    setLoading(true);
    setEmail("");
    setError(null);

    // --- NOWA LOGIKA NAPRAWIANIA URL ---
    let formattedUrl = url.trim();
    // Jeśli adres nie zaczyna się od http:// ani https://, dodajemy to automatycznie
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = "https://" + formattedUrl;
    }
    // ------------------------------------

    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

      if (!webhookUrl) {
        throw new Error("Brak adresu Webhooka w konfiguracji!");
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // WAŻNE: wysyłamy teraz naszą naprawioną zmienną 'formattedUrl', a nie surowe 'url'
        body: JSON.stringify({ companyUrl: formattedUrl }),
      });

      // Sprawdzamy, czy status HTTP to 200-299
      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      const data = await response.json();

      // Defensywne programowanie: bezpiecznie sprawdzamy czy dane istnieją (Optional Chaining)
      if (data && data[0] && data[0].text) {
        setEmail(data[0].text);
      } else {
        throw new Error("Otrzymano nieprawidłowy format danych z n8n.");
      }
    } catch (err) {
      console.error("Szczegóły błędu:", err);
      // Ustawiamy ładny komunikat błędu dla użytkownika
      setError(
        err.message ||
          "Wystąpił problem z wygenerowaniem maila. Spróbuj ponownie.",
      );
    } finally {
      // Ten blok wykona się zawsze, niezależnie czy był sukces, czy błąd
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Generator Leadów B2B 🚀</h1>
        <p>
          Wpisz adres URL firmy, a AI przeanalizuje ich stronę i napisze
          spersonalizowanego maila sprzedażowego.
        </p>
      </header>

      <form onSubmit={generateLead} className="form-group">
        <input
          type="text" // ZMIANA Z "url" na "text"
          placeholder="np. apple.com" // Możemy też zmienić placeholder na bardziej przyjazny
          value={url}
          onChange={(e) => setUrl(e.target.value)}
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

      {/* Warunkowe renderowanie błędów */}
      {error && (
        <div className="error-box">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Warunkowe renderowanie sukcesu */}
      {email && !error && (
        <div className="result-box">
          <h3>Wygenerowany Mail:</h3>
          <div className="email-content">{email}</div>
        </div>
      )}
    </div>
  );
}

export default App;
