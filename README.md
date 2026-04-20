# Radio-App 🎵

Eine moderne Radio-App für die Interaktion zwischen Hörer:innen und Moderator:innen, entwickelt als Teil des MSE-Projekts.

## 📱 Funktionen

### Für Hörer:innen
- **🎵 Aktuelle Song-Informationen**: Titel, Künstler, Album und Wiedergabedauer
- **⭐ Playlist-Bewertung**: 5-Sterne-Bewertung mit optionalen Kommentaren
- **🎤 Song-Wünsche**: Künstler und Titel mit persönlicher Nachricht einreichen
- **🎙️ Moderator-Bewertung**: Bewertung der aktuellen Moderation mit Feedback

### Für Moderator:innen
- **📊 Echtzeit-Dashboard**: Live-Anzeige aller Bewertungen und Wünsche
- **📈 Statistiken**: Durchschnittsbewertungen und Aktivitätsübersicht
- **🔔 Sofort-Benachrichtigungen**: Echtzeit-Updates bei neuen Bewertungen und Wünschen
- **🎵 Aktuelle Sendungs-Infos**: Anzeige des aktuell gespielten Titels

## 🛠️ Technologie-Stack

### Backend
- **Node.js** mit **Express.js** als Webserver
- **Socket.IO** für Echtzeit-Kommunikation
- **CORS** für Cross-Origin-Anfragen
- **UUID** für eindeutige IDs

### Frontend
- **React** als UI-Framework
- **Tailwind CSS** für modernes, responsives Design
- **Socket.IO Client** für Echtzeit-Updates
- **Axios** für HTTP-Anfragen

## 🏗️ Projektstruktur

```
ProjektberichtMSE/
├── server/
│   └── index.js                 # Backend-Server mit API-Endpunkten
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RadioApp.js           # Haupt-App für Hörer:innen
│   │   │   ├── CurrentSong.js        # Aktuelle Song-Informationen
│   │   │   ├── PlaylistRating.js     # Playlist-Bewertung
│   │   │   ├── SongRequest.js        # Song-Wunsch-Formular
│   │   │   ├── ModeratorRating.js    # Moderator-Bewertung
│   │   │   ├── ModeratorDashboard.js # Moderator-Dashboard
│   │   │   └── AppRouter.js          # Router zwischen Ansichten
│   │   ├── App.js              # React-Hauptkomponente
│   │   └── index.css           # Tailwind CSS
│   ├── package.json
│   └── tailwind.config.js
├── package.json                 # Root-Package-Datei
└── README.md                    # Diese Datei
```

## 🚀 Installation und Start

### Voraussetzungen
- Node.js (Version 14 oder höher)
- npm oder yarn

### Installation
1. Repository klonen und in das Verzeichnis wechseln
2. Alle Abhängigkeiten installieren:
   ```bash
   npm run install-all
   ```

### Entwicklung starten
```bash
npm run dev
```
Dies startet sowohl das Backend (Port 5000) als auch das Frontend (Port 3000) parallel.

### Manuelles Starten
Backend starten:
```bash
npm run server
```

Frontend starten (in neuem Terminal):
```bash
npm run client
```

## 📡 API-Endpunkte

### Song-Informationen
- `GET /api/current-song` - Aktuell gespielter Titel
- `GET /api/moderator-info` - Informationen zum aktuellen Moderator

### Bewertungen
- `POST /api/playlist-rating` - Playlist bewerten
- `POST /api/moderator-rating` - Moderator bewerten
- `GET /api/playlist-ratings` - Letzte Playlist-Bewertungen
- `GET /api/moderator-ratings` - Letzte Moderator-Bewertungen

### Song-Wünsche
- `POST /api/song-request` - Song-Wunsch einreichen
- `GET /api/song-requests` - Letzte Song-Wünsche

## 🔌 System-Integration (Stubs)

Die App enthält Stubs für die Integration mit bestehenden Systemen des Senders:

### RadioSystemStub
- `getCurrentSong()` - Liefert aktuelle Song-Informationen
- `updateCurrentSong(songData)` - Aktualisiert den aktuellen Song

### RatingSystemStub
- `forwardPlaylistRating(rating)` - Leitet Playlist-Bewertungen weiter
- `forwardModeratorRating(rating)` - Leitet Moderator-Bewertungen weiter

### RequestSystemStub
- `forwardSongRequest(request)` - Leitet Song-Wünsche weiter

Diese Stubs simulieren die Kommunikation mit den Sendersystemen und können durch echte Implementierungen ersetzt werden.

## 🎨 Design-Features

- **Modernes UI**: Purple-to-Pink Gradient mit Glassmorphismus-Effekten
- **Responsive Design**: Optimiert für Desktop und Mobile
- **Echtzeit-Updates**: Live-Benachrichtigungen ohne Seiten-Reload
- **Barrierefreiheit**: Klare Kontraste und intuitive Navigation

## 🔄 Echtzeit-Funktionalität

Die App verwendet Socket.IO für Echtzeit-Kommunikation:

- **Song-Updates**: Automatische Aktualisierung bei Titelwechsel
- **Bewertungen**: Sofortige Benachrichtigung an Moderator:innen
- **Song-Wünsche**: Live-Anzeige neuer Wünsche im Dashboard

## 📱 User Stories Implementation

✅ **Als Hörer:in möchte ich Informationen zum aktuell gespielten Titel sehen können**
- Implementiert in `CurrentSong.js` mit Echtzeit-Updates

✅ **Als Hörer:in möchte ich die Playlist bewerten können**
- Implementiert in `PlaylistRating.js` mit 5-Sterne-System

✅ **Als Hörer:in möchte ich mir einen Song wünschen können**
- Implementiert in `SongRequest.js` mit Formularvalidierung

✅ **Als Hörer:in möchte ich den:die Radiomoderator:in bewerten können**
- Implementiert in `ModeratorRating.js` mit Kommentar-Funktion

✅ **Als Radiomoderator:in möchte ich sofort über aktuelle Bewertungen Bescheid bekommen**
- Implementiert in `ModeratorDashboard.js` mit Socket.IO Echtzeit-Updates

## 🧪 Demo-Modus

Die App enthält einen Demo-Modus zum Wechseln zwischen:
- **Hörer:innen Ansicht**: Volle Funktionalität für Endbenutzer
- **Moderator Ansicht**: Dashboard mit Echtzeit-Updates und Statistiken

Der Wechsel erfolgt über den Button oben rechts in der Ecke.

## 📝 Lizenz

Dieses Projekt wurde im Rahmen des MSE-Projekts entwickelt.

## 🤝 Contributing

Für Verbesserungsvorschläge und Bug-Reports bitte Issues erstellen.

---

**Entwickelt mit ❤️ für die Radio-Community**
