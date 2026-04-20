import React, { useState } from 'react';

function SongRequest() {
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!artist.trim() || !title.trim()) {
      setFeedback({ type: 'error', message: 'Bitte gib sowohl Künstler als auch Titel an.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('http://localhost:5000/api/song-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artist: artist.trim(),
          title: title.trim(),
          message: message.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setFeedback({ 
          type: 'success', 
          message: 'Dein Song-Wunsch wurde erfolgreich gesendet! Wir versuchen ihn bald zu spielen.' 
        });
        setArtist('');
        setTitle('');
        setMessage('');
      } else {
        setFeedback({ type: 'error', message: 'Fehler beim Senden des Wunsches.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Verbindungsfehler. Bitte versuche es später erneut.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">🎵 Song wünschen</h2>
      
      <p className="text-gray-300 mb-6">
        Hast du einen Lieblingssong, den du gerne hören möchtest? Schick uns deinen Wunsch!
        Wir berücksichtigen alle Wünsche bei der Playlist-Gestaltung.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Künstler */}
        <div>
          <label htmlFor="artist" className="block text-white font-medium mb-3">
            Künstler/in *
          </label>
          <input
            type="text"
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="z.B. Queen"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
            maxLength="100"
          />
        </div>

        {/* Titel */}
        <div>
          <label htmlFor="title" className="block text-white font-medium mb-3">
            Titel *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Bohemian Rhapsody"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
            maxLength="100"
          />
        </div>

        {/* Nachricht */}
        <div>
          <label htmlFor="message" className="block text-white font-medium mb-3">
            Nachricht (optional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Warum möchtest du diesen Song hören? Ist es ein besonderer Anlass?"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all resize-none"
            rows="3"
            maxLength="300"
          />
          <p className="text-gray-400 text-sm mt-1">
            {message.length}/300 Zeichen
          </p>
        </div>

        {/* Feedback-Meldung */}
        {feedback && (
          <div
            className={`p-4 rounded-lg ${
              feedback.type === 'success'
                ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                : 'bg-red-500/20 text-red-200 border border-red-500/30'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Submit-Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? 'Wird gesendet...' : 'Song-Wunsch senden'}
        </button>
      </form>

      <div className="mt-8 p-4 bg-white/5 rounded-lg">
        <h3 className="text-white font-semibold mb-2">📝 Hinweis</h3>
        <p className="text-gray-300 text-sm">
          Wir können leider nicht jeden Wunsch berücksichtigen, aber wir lesen alle sorgfältig.
          Manchmal gibt es technische oder rechtliche Gründe, warum ein Song nicht gespielt werden kann.
        </p>
      </div>
    </div>
  );
}

export default SongRequest;
