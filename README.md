# 🤖 B2B Lead Generator

Aplikacja webowa automatycznie generująca spersonalizowane maile prospectingowe na podstawie analizy strony internetowej firmy. Wystarczy podać URL — reszta dzieje się automatycznie dzięki n8n i AI.

**🔗 Live demo:** [marcinKgit1.github.io/B2B-Lead-Generator](https://marcinkgit1.github.io/B2B-Lead-Generator/)

---

## Jak to działa

```
Użytkownik podaje URL → n8n scrape'uje stronę → AI pisze maila → Wynik wraca do aplikacji
```

1. Użytkownik wpisuje adres strony firmy
2. Frontend wysyła URL do webhooka n8n (POST)
3. n8n pobiera treść strony przez [Jina AI Reader](https://r.jina.ai/) (obsługuje JS i Cloudflare)
4. AI analizuje treść i generuje spersonalizowany mail B2B
5. Gotowy mail pojawia się w aplikacji

---

## Stack technologiczny

| Warstwa | Technologia |
|---|---|
| Frontend | React 19 + Vite |
| Automatyzacja | n8n (self-hosted) |
| Scraping | Jina AI Reader (`r.jina.ai`) |
| AI | Model językowy (przez n8n) |
| Hosting | GitHub Pages |

---

## Uruchomienie lokalne

### Wymagania
- Node.js 18+
- Działający webhook n8n

### Instalacja

```bash
# Sklonuj repozytorium
git clone https://github.com/marcinKgit1/B2B-Lead-Generator.git
cd B2B-Lead-Generator

# Zainstaluj zależności
npm install

# Skonfiguruj zmienne środowiskowe
cp .env.example .env
```

Uzupełnij `.env`:
```env
VITE_N8N_WEBHOOK_URL=https://twoj-n8n.cloud/webhook/generate-lead
```

```bash
# Uruchom dev server
npm run dev
```

---

## Konfiguracja n8n workflow

Workflow składa się z 5 node'ów:

```
Webhook → HTTP Request (Jina) → Code JS (czyszczenie) → AI → Respond to Webhook
```

### Node: HTTP Request
- **Method:** GET  
- **URL:** `https://r.jina.ai/{{ $json.body.companyUrl }}`
- **Settings:** Continue on Fail: ON, Timeout: 15000
- **Headers:**
  - `User-Agent`: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36`
  - `Accept`: `text/html,application/xhtml+xml`

### Node: Code in JavaScript
Czyści pobraną treść i ogranicza do 15 000 znaków przed wysłaniem do AI.

### Node: Respond to Webhook
Zwraca odpowiedź w formacie:
```json
[{ "text": "Treść wygenerowanego maila..." }]
```

---

## Zmienne środowiskowe

| Zmienna | Opis |
|---|---|
| `VITE_N8N_WEBHOOK_URL` | URL webhooka n8n (wymagana) |

---

## Struktura projektu

```
src/
├── components/
│   ├── Header.jsx       # Nagłówek aplikacji
│   ├── LeadForm.jsx     # Formularz z polem URL
│   ├── ResultBox.jsx    # Wyświetlanie wygenerowanego maila
│   └── ErrorBox.jsx     # Komunikaty błędów
├── hooks/
│   └── useLeadGenerator.js  # Logika: fetch, obsługa błędów, timeout
├── App.jsx
└── App.css
```

---

## Deployment (GitHub Pages)

```bash
npm run build
```

Deployment odbywa się automatycznie przez GitHub Actions po każdym push na branch `main`.

---

## Znane ograniczenia

- Strony z bardzo agresywnym Cloudflare mogą być niedostępne
- Strony bez treści tekstowej (tylko grafiki) dadzą słabe wyniki
- Jina AI Reader ma limit requestów w darmowym planie
