# 📚 BookTrack - Persönliche Buch-Verwaltung

Eine moderne Web-Anwendung zum Verwalten deiner Bücher, Lesefortschritt, Notizen und Zitate.

![BookTrack](https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&h=400&fit=crop)

## ✨ Features

### Bücherverwaltu­ng
- ✅ Bücher hinzufügen (manuell oder per ISBN)
- ✅ Status-Tracking (Wunschliste, Lese ich, Gelesen)
- ✅ Bewertungssystem (1-5 Sterne)
- ✅ Genres und Tags
- ✅ Fortschritts-Tracking

### Lese-Features
- 📖 Lese-Session Timer
- 📝 Notizen zu Büchern
- 💬 Zitate speichern
- 📊 Statistiken und Charts
- 🔍 Such- und Filterfunktionen

### Technologie
- 🎨 Modernes, responsives UI
- 🔐 Benutzer-Authentication (JWT)
- 💾 PostgreSQL Datenbank
- ⚡ React Query für State Management
- 🚀 Vite für schnelle Development Experience

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **TanStack React Query** - Server State Management
- **React Router v6** - Routing
- **shadcn/ui** - UI Components
- **Tailwind CSS** - Styling
- **Zod** - Validation

### Backend
- **Node.js + Express** - Server Framework
- **TypeScript** - Type Safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password Hashing
- **Zod** - Request Validation

## 📋 Voraussetzungen

- Node.js 18+ (empfohlen: 20.x)
- PostgreSQL 14+
- npm oder yarn
- Git

## 🚀 Installation & Setup

### 1. Repository klonen

```bash
git clone <repository-url>
cd inkwell-atlas
```

### 2. PostgreSQL Datenbank einrichten

Erstelle eine PostgreSQL Datenbank:

```bash
# PostgreSQL CLI
createdb booktrack

# Oder mit psql:
psql -U postgres
CREATE DATABASE booktrack;
\q
```

### 3. Backend Setup

```bash
cd server

# Dependencies installieren
npm install

# .env Datei erstellen (von .env.example kopieren)
cp .env.example .env

# .env anpassen mit deinen Datenbank-Credentials:
# DATABASE_URL="postgresql://user:password@localhost:5432/booktrack?schema=public"
# JWT_SECRET="dein-sicherer-secret-key"

# Prisma migrieren
npm run prisma:migrate

# Prisma Client generieren
npm run prisma:generate

# (Optional) Datenbank mit Test-Daten füllen
npm run db:seed
```

**Wichtig**: Die `.env` Datei enthält sensible Daten und sollte NIEMALS committed werden!

### 4. Frontend Setup

```bash
# Zurück zum Root-Verzeichnis
cd ..

# Dependencies installieren
npm install
```

### 5. Anwendung starten

#### Option A: Development Mode (empfohlen)

Öffne **zwei separate Terminals**:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server läuft auf: `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend läuft auf: `http://localhost:8080`

#### Option B: Production Build

```bash
# Backend Build
cd server
npm run build
npm start

# Frontend Build (in neuem Terminal)
cd ..
npm run build
npm run preview
```

## 🔑 Test-Zugangsdaten

Nach dem Seeding (`npm run db:seed`) sind folgende Test-Credentials verfügbar:

```
E-Mail: test@booktrack.com
Passwort: test1234
```

## 📁 Projekt-Struktur

```
inkwell-atlas/
├── server/                    # Backend
│   ├── src/
│   │   ├── controllers/       # API Controller
│   │   ├── middleware/        # Express Middleware
│   │   ├── routes/            # API Routes
│   │   ├── types/             # TypeScript Types & Zod Schemas
│   │   ├── utils/             # Utilities (DB, Seed)
│   │   └── index.ts           # Server Entry Point
│   ├── prisma/
│   │   └── schema.prisma      # Datenbank Schema
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── src/                       # Frontend
│   ├── components/            # React Components
│   │   ├── Books/             # Buch-Komponenten
│   │   ├── Layout/            # Layout-Komponenten
│   │   ├── auth/              # Auth-Komponenten
│   │   └── ui/                # shadcn/ui Komponenten
│   ├── contexts/              # React Contexts
│   │   └── AuthContext.tsx    # Authentication Context
│   ├── hooks/                 # Custom Hooks
│   │   ├── useBooks.ts        # React Query Hooks
│   │   └── use-toast.ts       # Toast Hook
│   ├── lib/                   # Libraries & Utils
│   │   ├── api.ts             # API Client
│   │   └── utils.ts           # Utilities
│   ├── pages/                 # Page Components
│   ├── types/                 # TypeScript Types
│   ├── App.tsx                # App Entry Point
│   └── main.tsx               # React Entry Point
│
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## 🔧 Verfügbare Scripts

### Frontend
```bash
npm run dev          # Development Server starten
npm run build        # Production Build
npm run preview      # Build-Vorschau
npm run lint         # ESLint ausführen
```

### Backend
```bash
npm run dev                # Development Server (mit Hot Reload)
npm run build              # TypeScript kompilieren
npm start                  # Production Server
npm run prisma:generate    # Prisma Client generieren
npm run prisma:migrate     # Datenbank migrieren
npm run prisma:studio      # Prisma Studio (DB GUI)
npm run db:seed            # Datenbank mit Test-Daten füllen
```

## 📡 API-Endpunkte

### Authentication
- `POST /api/auth/register` - Neuen Benutzer registrieren
- `POST /api/auth/login` - Benutzer anmelden
- `GET /api/auth/profile` - Benutzerprofil abrufen

### Books
- `GET /api/books` - Alle Bücher abrufen
- `GET /api/books/:id` - Einzelnes Buch
- `POST /api/books` - Neues Buch erstellen
- `PUT /api/books/:id` - Buch aktualisieren
- `DELETE /api/books/:id` - Buch löschen
- `GET /api/books/isbn/:isbn` - Buch per ISBN suchen

### Reading Sessions
- `GET /api/reading-sessions/book/:bookId` - Sessions für Buch
- `POST /api/reading-sessions` - Neue Session erstellen
- `PUT /api/reading-sessions/:id` - Session aktualisieren
- `DELETE /api/reading-sessions/:id` - Session löschen

### Quotes
- `GET /api/quotes` - Alle Zitate
- `GET /api/quotes/book/:bookId` - Zitate für Buch
- `POST /api/quotes` - Neues Zitat
- `PUT /api/quotes/:id` - Zitat aktualisieren
- `DELETE /api/quotes/:id` - Zitat löschen

### Notes
- `GET /api/notes/book/:bookId` - Notizen für Buch
- `POST /api/notes` - Neue Notiz
- `PUT /api/notes/:id` - Notiz aktualisieren
- `DELETE /api/notes/:id` - Notiz löschen

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/booktrack?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:8080"
```

## 🐛 Troubleshooting

### Backend startet nicht
- Prüfe PostgreSQL-Verbindung
- Stelle sicher, dass die Datenbank existiert
- Überprüfe `.env` Konfiguration
- Führe `npm run prisma:migrate` aus

### Frontend kann nicht mit Backend kommunizieren
- Stelle sicher, dass Backend läuft (`http://localhost:3001`)
- Prüfe Proxy-Konfiguration in `vite.config.ts`
- Überprüfe CORS-Einstellungen in `server/src/index.ts`

### Prisma Errors
```bash
# Prisma Client neu generieren
npm run prisma:generate

# Datenbank zurücksetzen
npx prisma migrate reset

# Prisma Studio zum Debugging
npm run prisma:studio
```

### Authentication Probleme
- Lösche localStorage: `localStorage.clear()` in Browser Console
- Überprüfe JWT_SECRET in `.env`
- Prüfe Token-Ablauf (Standard: 7 Tage)

## 📝 Nächste Schritte

Mögliche Erweiterungen:
- [ ] ISBN-API Integration (OpenLibrary/Google Books)
- [ ] Dark Mode Toggle
- [ ] Export/Import-Funktion
- [ ] Social Features (Bücher teilen)
- [ ] Mobile App (React Native)
- [ ] E-Book Integration
- [ ] Goodreads Import
- [ ] Reading Goals & Challenges
- [ ] Book Recommendations

## 🤝 Contributing

Contributions sind willkommen! Bitte:
1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details

## 👨‍💻 Autor

Erstellt mit ❤️ und Claude Code

## 🙏 Danksagungen

- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Radix UI](https://www.radix-ui.com/) - Headless UI
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Prisma](https://www.prisma.io/) - ORM
- [TanStack Query](https://tanstack.com/query) - Data Fetching

---

**Happy Reading! 📚**
