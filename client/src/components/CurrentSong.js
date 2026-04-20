import React from 'react';

function CurrentSong({ song }) {
  if (!song) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-white/20 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="text-gray-300 mt-4">Lade aktuelle Song-Informationen...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
      <div className="flex items-center space-x-6">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        </div>
        
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-2">{song.title}</h2>
          <p className="text-xl text-gray-200 mb-1">{song.artist}</p>
          <p className="text-gray-300 mb-3">Album: {song.album}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {song.duration}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Seit {new Date(song.startTime).toLocaleTimeString('de-DE')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <h3 className="text-white font-semibold mb-2">🎧 Jetzt live auf Sendung</h3>
        <p className="text-gray-300 text-sm">
          Dieser Song wird aktuell über unsere Frequenzen ausgestrahlt. 
          Gefällt dir der Song? Bewerte die Playlist oder wünsche dir deinen Lieblingssong!
        </p>
      </div>
    </div>
  );
}

export default CurrentSong;
