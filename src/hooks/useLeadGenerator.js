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

      let data;
      const rawText = await response.text();

      if (!rawText || rawText.trim() === "") {
        throw new Error(
          "Webhook n8n zwrócił pustą odpowiedź. Sprawdź czy workflow ma podłączony node 'Respond to Webhook'."
        );
      }

      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          `Webhook zwrócił nieprawidłowy JSON. Odpowiedź: "${rawText.slice(0, 80)}..."`
        );
      }

      if (data && data[0] && data[0].text) {
        setEmail(data[0].text);
      } else {
        throw new Error(
          "Nieoczekiwany format odpowiedzi z n8n. Oczekiwano: [{text: '...'}]"
        );
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
