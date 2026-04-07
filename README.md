# PassGo Frontend

## Uruchomienie w trybie dev

### 1. Skonfiguruj zmienne środowiskowe

Skopiuj przykładowy plik i uzupełnij wartości:

```bash
cp .env.dev-example .env.dev
```

> **Uwaga:** Uzupełnij `.env.dev` przed uruchomieniem:
> - `VITE_API_HOSTNAME` — hostname backendu (np. `localhost`)
> - `VITE_API_PORT` — port backendu (np. `9090`)

### 2. Zainstaluj zależności

```bash
npm install
```

### 3. Uruchom serwer deweloperski

```bash
npm run dev -- --mode dev
```

Aplikacja będzie dostępna pod `http://localhost:5173`. Requesty do `/api` są proxy'owane na backend zgodnie z konfiguracją w `.env.dev`.
