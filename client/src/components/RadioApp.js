import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CurrentSong from './CurrentSong';
import PlaylistRating from './PlaylistRating';
import SongRequest from './SongRequest';
import ModeratorRating from './ModeratorRating';

const socket = io('http://localhost:5000');

function RadioApp() {
  const [currentSong, setCurrentSong] = useState(null);
  const [activeTab, setActiveTab] = useState('song');

  useEffect(() => {
    // Hole aktuellen Song beim Laden
    fetch('http://localhost:5000/api/current-song')
      .then(res => res.json())
      .then(data => setCurrentSong(data))
      .catch(err => console.error('Fehler beim Laden des aktuellen Songs:', err));

    // Echtzeit-Updates für Song-Wechsel
    socket.on('songUpdate', (song) => {
      setCurrentSong(song);
    });

    return () => {
      socket.off('songUpdate');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎵 Radio-App</h1>
          <p className="text-gray-300">Interagiere mit deinem Lieblingssender</p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-1">
            <button
              onClick={() => setActiveTab('song')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'song'
                  ? 'bg-white text-purple-900'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Aktueller Song
            </button>
            <button
              onClick={() => setActiveTab('rating')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'rating'
                  ? 'bg-white text-purple-900'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Playlist bewerten
            </button>
            <button
              onClick={() => setActiveTab('request')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'request'
                  ? 'bg-white text-purple-900'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Song wünschen
            </button>
            <button
              onClick={() => setActiveTab('moderator')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'moderator'
                  ? 'bg-white text-purple-900'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Moderator bewerten
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'song' && <CurrentSong song={currentSong} />}
          {activeTab === 'rating' && <PlaylistRating currentSongId={currentSong?.id} />}
          {activeTab === 'request' && <SongRequest />}
          {activeTab === 'moderator' && <ModeratorRating />}
        </div>
      </div>
    </div>
  );
}

export default RadioApp;
