const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Mock-Daten für den Betrieb
let currentSong = {
  id: uuidv4(),
  title: "Bohemian Rhapsody",
  artist: "Queen",
  album: "A Night at the Opera",
  duration: "5:55",
  startTime: new Date().toISOString()
};

let playlistRatings = [];
let songRequests = [];
let moderatorRatings = [];
let currentModerator = {
  id: uuidv4(),
  name: "Anna Schmidt",
  show: "Morgenmagazin"
};

// Stub für externes System: Titel-Informationen
const radioSystemStub = {
  getCurrentSong: () => currentSong,
  updateCurrentSong: (songData) => {
    currentSong = { ...songData, id: uuidv4(), startTime: new Date().toISOString() };
    io.emit('songUpdate', currentSong);
    return currentSong;
  }
};

// Stub für externes System: Bewertungs-Weiterleitung
const ratingSystemStub = {
  forwardPlaylistRating: (rating) => {
    console.log(`Bewertung an Sendersystem weitergeleitet:`, rating);
    return { success: true, id: uuidv4() };
  },
  forwardModeratorRating: (rating) => {
    console.log(`Moderator-Bewertung an Sendersystem weitergeleitet:`, rating);
    return { success: true, id: uuidv4() };
  }
};

// Stub für externes System: Song-Wunsch-Weiterleitung
const requestSystemStub = {
  forwardSongRequest: (request) => {
    console.log(`Song-Wunsch an Sendersystem weitergeleitet:`, request);
    return { success: true, id: uuidv4() };
  }
};

// API-Endpunkte
app.get('/api/current-song', (req, res) => {
  res.json(radioSystemStub.getCurrentSong());
});

app.post('/api/playlist-rating', (req, res) => {
  const { rating, comment } = req.body;
  const newRating = {
    id: uuidv4(),
    rating,
    comment,
    timestamp: new Date().toISOString(),
    songId: currentSong.id
  };
  
  playlistRatings.push(newRating);
  ratingSystemStub.forwardPlaylistRating(newRating);
  
  // Echtzeit-Benachrichtigung an Moderator:innen
  io.emit('newPlaylistRating', newRating);
  
  res.json({ success: true, rating: newRating });
});

app.post('/api/song-request', (req, res) => {
  const { artist, title, message } = req.body;
  const newRequest = {
    id: uuidv4(),
    artist,
    title,
    message,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
  
  songRequests.push(newRequest);
  requestSystemStub.forwardSongRequest(newRequest);
  
  io.emit('newSongRequest', newRequest);
  
  res.json({ success: true, request: newRequest });
});

app.post('/api/moderator-rating', (req, res) => {
  const { rating, comment } = req.body;
  const newRating = {
    id: uuidv4(),
    moderatorId: currentModerator.id,
    moderatorName: currentModerator.name,
    rating,
    comment,
    timestamp: new Date().toISOString()
  };
  
  moderatorRatings.push(newRating);
  ratingSystemStub.forwardModeratorRating(newRating);
  
  // Echtzeit-Benachrichtigung an Moderator:innen
  io.emit('newModeratorRating', newRating);
  
  res.json({ success: true, rating: newRating });
});

app.get('/api/moderator-info', (req, res) => {
  res.json(currentModerator);
});

app.get('/api/playlist-ratings', (req, res) => {
  res.json(playlistRatings.slice(-10)); // Letzte 10 Bewertungen
});

app.get('/api/moderator-ratings', (req, res) => {
  res.json(moderatorRatings.slice(-10)); // Letzte 10 Bewertungen
});

app.get('/api/song-requests', (req, res) => {
  res.json(songRequests.slice(-20)); // Letzte 20 Wünsche
});

// Socket.IO für Echtzeit-Kommunikation
io.on('connection', (socket) => {
  console.log('Neue Verbindung:', socket.id);
  
  // Sende aktuelle Daten bei Verbindung
  socket.emit('songUpdate', currentSong);
  socket.emit('currentModerator', currentModerator);
  
  socket.on('disconnect', () => {
    console.log('Verbindung getrennt:', socket.id);
  });
});

// Simuliere Titel-Wechsel alle 30 Sekunden
setInterval(() => {
  const mockSongs = [
    { title: "Imagine", artist: "John Lennon", album: "Imagine" },
    { title: "Hotel California", artist: "Eagles", album: "Hotel California" },
    { title: "Stairway to Heaven", artist: "Led Zeppelin", album: "Led Zeppelin IV" },
    { title: "Sweet Child O' Mine", artist: "Guns N' Roses", album: "Appetite for Destruction" }
  ];
  
  const randomSong = mockSongs[Math.floor(Math.random() * mockSongs.length)];
  radioSystemStub.updateCurrentSong(randomSong);
}, 30000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
