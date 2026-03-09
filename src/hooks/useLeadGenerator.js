import { useState } from "react";

export function useLeadGenerator() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateLead = async (e) => {
    e.preventDefault();

    setLoading(true);
    setEmail("");
    setError(null);

    // Automatyczne dodanie protokołu jeśli brak
    let formattedUrl = url.trim();
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = "https://" + formattedUrl;
    }

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
        body: JSON.stringify({ companyUrl: formattedUrl }),
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      const data = await response.json();

      if (data && data[0] && data[0].text) {
        setEmail(data[0].text);
      } else {
        throw new Error("Otrzymano nieprawidłowy format danych z n8n.");
      }
    } catch (err) {
      console.error("Szczegóły błędu:", err);
      setError(
        err.message ||
          "Wystąpił problem z wygenerowaniem maila. Spróbuj ponownie."
      );
    } finally {
      setLoading(false);
    }
  };

  return { url, setUrl, email, loading, error, generateLead };
}
