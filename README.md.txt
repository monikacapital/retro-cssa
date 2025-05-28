# RETRO_CSSA 2.0

**RETRO_CSSA** to nowoczesna aplikacja fullstack do retrospektyw zespołowych i planning poker z integracją Microsoft Teams i YouTrack.

---

## 🚀 Nowe funkcje v2.0

- **👤 Przypisywanie osób do zadań** podczas planning poker
- **🔗 Automatyczne matchowanie kont** Teams ↔ YouTrack  
- **📋 Auto-wyświetlanie zadań** z YouTrack po numerze
- **✅ Synchronizacja action items** do Teams TODO lists
- **🎯 Widoki zależne od roli** (Developer/Tester vs Project Manager)
- **📊 Rozszerzone statystyki** estymacji (jak Dzikie Historyjki)

---

## 📁 Struktura projektu

retro_cssa/
├── backend/ # Node.js/Express API
│ ├── routes/ # Endpointy API
│ ├── utils/ # Funkcje pomocnicze
│ └── middleware/ # Autoryzacja i walidacja
├── src/ # React frontend
│ ├── components/ # Komponenty UI
│ ├── utils/ # Funkcje pomocnicze frontend
│ └── styles/ # CSS
└── public/ # Statyczne pliki frontend

text

---

## ⚡ Szybki start

### Backend

cd backend
npm install
cp .env.example .env # skonfiguruj zmienne środowiskowe
npm run dev

text

### Frontend

cd src
npm install
npm start

text

Aplikacja będzie dostępna na:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000

---

## 🔧 Konfiguracja

### Zmienne środowiskowe (.env)

**Backend:**

MS_CLIENT_ID=your-microsoft-client-id
MS_CLIENT_SECRET=your-microsoft-client-secret
YOUTRACK_API_URL=https://youtrack.example.com/api
YOUTRACK_TOKEN=perm:your-youtrack-token
SESSION_SECRET=your-session-secret

text

**Frontend:**

REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_MS_CLIENT_ID=your-microsoft-client-id

text

---

## 🎯 Role użytkowników

| Rola | Uprawnienia |
|------|-------------|
| **Developer/Tester** | Udział w retro, estymacja zadań, dodawanie notatek |
| **Project Manager** | Wszystkie powyższe + dodawanie zadań, ujawnianie głosów, eksport, przypisywanie osób |

---

## 🔗 Integracje

### Microsoft Teams
- **OAuth 2.0** - logowanie przez konto firmowe
- **Graph API** - pobieranie użytkowników i obecności
- **TODO Lists** - synchronizacja action items
- **Kanały** - wysyłanie podsumowań retro

### YouTrack
- **REST API** - pobieranie zadań po numerze
- **Estymacje** - eksport story points
- **Assignee** - przypisywanie osób do zadań
- **Komentarze** - dodawanie notatek z retro

---

## 📊 Funkcje

### Retrospektywy
- **Szablony:** Start/Stop/Continue, 4Ls, Glad/Sad/Mad
- **AI Assistant** - grupowanie podobnych tematów
- **Głosowanie** na notatki
- **Eksport** do Teams i PDF

### Planning Poker
- **Karty Fibonacci** + specjalne (?, ∞, ☕)
- **Statystyki** - średnia, mediana, odchylenie standardowe
- **Przypisywanie osób** do zadań
- **Integracja YouTrack** - pobieranie zadań po ID

### Matchowanie kont
- **Automatyczne** dopasowanie po emailu
- **Sugestie** na podstawie podobieństwa nazw
- **Walidacja** mapowań
- **Statystyki** pokrycia

---

## 🛠️ Rozwój

### Uruchomienie środowiska deweloperskiego

Terminal 1: Backend

cd backend && npm run dev
Terminal 2: Frontend

cd src && npm start

text

### Testowanie

Backend

cd backend && npm test
Frontend

cd src && npm test

text

### Build produkcyjny

Frontend

cd src && npm run build
Backend

cd backend && npm start

text

---

## 📈 Deployment

### Frontend (Vercel/Netlify)
1. Połącz repo z Vercel
2. Ustaw build command: `npm run build`
3. Ustaw zmienne środowiskowe

### Backend (Heroku/Azure)
1. Utwórz aplikację na platformie
2. Ustaw zmienne środowiskowe
3. Deploy z repozytorium

---

## 🤝 Wkład w projekt

1. Fork repozytorium
2. Stwórz branch funkcji (`git checkout -b feature/nazwa`)
3. Commit zmian (`git commit -m 'Dodaj funkcję'`)
4. Push do brancha (`git push origin feature/nazwa`)
5. Otwórz Pull Request

---

## 📜 Licencja

MIT License - szczegóły w pliku [LICENSE](LICENSE)

---

## 👥 Autorzy

- **Twoje Imię** - *Initial work* - [GitHub](https://github.com/username)

---

## 🆘 Wsparcie

W razie problemów:
1. Sprawdź [Issues](https://github.com/username/retro_cssa/issues)
2. Utwórz nowy Issue z opisem problemu
3. Dołącz logi z konsoli przeglądarki/serwera

---

**Powered by Capital Service** 🚀

Struktura katalogów - finalna

text
retro_cssa/
├── backend/
│   ├── server.js
│   ├── config.js
│   ├── package.json
│   ├── routes/
│   │   ├── auth.js
│   │   ├── teams.js
│   │   ├── youtrack.js
│   │   ├── retro.js
│   │   ├── planning.js
│   │   └── accounts.js
│   ├── middleware/
│   │   └── auth.js
│   └── utils/
│       ├── teamsApi.js
│       ├── youtrackApi.js
│       ├── matchAccounts.js
│       └── todoSync.js
├── src/
│   ├── app.js
│   ├── index.js
│   ├── api.js
│   ├── auth.js
│   ├── package.json
│   ├── components/
│   │   ├── RetroBoard.js
│   │   ├── PlanningPoker.js
│   │   ├── UserList.js
│   │   ├── RoleBasedView.js
│   │   ├── TaskDetails.js
│   │   ├── AssignmentModal.js
│   │   └── AccountMatcher.js
│   ├── utils/
│   │   └── matchAccounts.js
│   └── styles/
│       └── styles.css
├── public/
│   ├── index.html
│   └── manifest.json
├── .env.example
├── .gitignore
├── README.md
└── LICENSE

