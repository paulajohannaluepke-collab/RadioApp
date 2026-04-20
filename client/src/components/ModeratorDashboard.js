import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function ModeratorDashboard() {
  const [playlistRatings, setPlaylistRatings] = useState([]);
  const [moderatorRatings, setModeratorRatings] = useState([]);
  const [songRequests, setSongRequests] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentModerator, setCurrentModerator] = useState(null);

  useEffect(() => {
    // Initiale Daten laden
    Promise.all([
      fetch('http://localhost:5000/api/current-song').then(res => res.json()),
      fetch('http://localhost:5000/api/moderator-info').then(res => res.json()),
      fetch('http://localhost:5000/api/playlist-ratings').then(res => res.json()),
      fetch('http://localhost:5000/api/moderator-ratings').then(res => res.json()),
      fetch('http://localhost:5000/api/song-requests').then(res => res.json())
    ]).then(([song, moderator, playlistRatings, moderatorRatings, songRequests]) => {
      setCurrentSong(song);
      setCurrentModerator(moderator);
      setPlaylistRatings(playlistRatings.reverse());
      setModeratorRatings(moderatorRatings.reverse());
      setSongRequests(songRequests.reverse());
    }).catch(err => console.error('Fehler beim Laden der Daten:', err));

    // Echtzeit-Updates
    socket.on('songUpdate', (song) => {
      setCurrentSong(song);
    });

    socket.on('currentModerator', (moderator) => {
      setCurrentModerator(moderator);
    });

    socket.on('newPlaylistRating', (rating) => {
      setPlaylistRatings(prev => [rating, ...prev.slice(0, 9)]);
    });

    socket.on('newModeratorRating', (rating) => {
      setModeratorRatings(prev => [rating, ...prev.slice(0, 9)]);
    });

    socket.on('newSongRequest', (request) => {
      setSongRequests(prev => [request, ...prev.slice(0, 19)]);
    });

    return () => {
      socket.off('songUpdate');
      socket.off('currentModerator');
      socket.off('newPlaylistRating');
      socket.off('newModeratorRating');
      socket.off('newSongRequest');
    };
  }, []);

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-400'}>
        ⭐
      </span>
    ));
  };

  if (!currentModerator) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Lade Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">🎙️ Moderator Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>{currentModerator.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
                <span>{currentModerator.show}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Aktuelle Song-Info */}
        {currentSong && (
          <div className="mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">🎵 Aktuell auf Sendung</h2>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{currentSong.title}</h3>
                <p className="text-gray-300">{currentSong.artist}</p>
                <p className="text-gray-400 text-sm">Album: {currentSong.album}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistiken */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">📊 Playlist-Bewertungen</h3>
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {calculateAverageRating(playlistRatings)}
            </div>
            <div className="text-gray-400 text-sm">
              Ø aus {playlistRatings.length} Bewertungen
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">⭐ Moderator-Bewertungen</h3>
            <div className="text-3xl font-bold text-pink-400 mb-1">
              {calculateAverageRating(moderatorRatings)}
            </div>
            <div className="text-gray-400 text-sm">
              Ø aus {moderatorRatings.length} Bewertungen
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">🎵 Song-Wünsche</h3>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {songRequests.length}
            </div>
            <div className="text-gray-400 text-sm">
              Offene Wünsche
            </div>
          </div>
        </div>

        {/* Live-Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Playlist-Bewertungen */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">📊 Neueste Playlist-Bewertungen</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {playlistRatings.length === 0 ? (
                <p className="text-gray-400">Noch keine Bewertungen</p>
              ) : (
                playlistRatings.map((rating) => (
                  <div key={rating.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(rating.rating)}
                      </div>
                      <span className="text-gray-400 text-sm">
                        {new Date(rating.timestamp).toLocaleTimeString('de-DE')}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-gray-300 text-sm">{rating.comment}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Song-Wünsche */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">🎵 Neueste Song-Wünsche</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {songRequests.length === 0 ? (
                <p className="text-gray-400">Noch keine Wünsche</p>
              ) : (
                songRequests.map((request) => (
                  <div key={request.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-white font-medium">{request.title}</span>
                        <span className="text-gray-400 mx-2">•</span>
                        <span className="text-gray-300">{request.artist}</span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {new Date(request.timestamp).toLocaleTimeString('de-DE')}
                      </span>
                    </div>
                    {request.message && (
                      <p className="text-gray-300 text-sm mt-2">{request.message}</p>
                    )}
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        request.status === 'pending' 
                          ? 'bg-yellow-500/20 text-yellow-300' 
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        {request.status === 'pending' ? 'Offen' : 'Erledigt'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Moderator-Bewertungen */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">⭐ Neueste Moderator-Bewertungen</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {moderatorRatings.length === 0 ? (
              <p className="text-gray-400">Noch keine Bewertungen</p>
            ) : (
              moderatorRatings.map((rating) => (
                <div key={rating.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(rating.rating)}
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(rating.timestamp).toLocaleTimeString('de-DE')}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-gray-300 text-sm">{rating.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModeratorDashboard;
