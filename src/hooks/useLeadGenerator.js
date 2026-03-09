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
        console.error(`[B2B] Błąd serwera: HTTP ${response.status}`);
        throw new Error("Usługa jest chwilowo niedostępna. Spróbuj ponownie za chwilę lub skontaktuj się z administratorem.");
      }

      let data;
      const rawText = await response.text();

      if (!rawText || rawText.trim() === "") {
        console.error("[B2B] Webhook zwrócił pustą odpowiedź.");
        throw new Error("Nie udało się wygenerować maila. Skontaktuj się z administratorem.");
      }

      try {
        data = JSON.parse(rawText);
      } catch {
        console.error("[B2B] Nieprawidłowy JSON:", rawText.slice(0, 200));
        throw new Error("Nie udało się wygenerować maila. Skontaktuj się z administratorem.");
      }

      if (data && data[0] && data[0].text) {
        setEmail(data[0].text);
      } else {
        console.error("[B2B] Nieoczekiwany format danych:", data);
        throw new Error("Nie udało się wygenerować maila. Skontaktuj się z administratorem.");
      }
    } catch (err) {
      console.error("[B2B] Szczegóły błędu:", err);
      setError(
        err.message ||
        "Wystąpił nieoczekiwany błąd. Skontaktuj się z administratorem."
      );
    } finally {
      setLoading(false);
    }
  };

  return { url, setUrl, email, loading, error, generateLead };
}
