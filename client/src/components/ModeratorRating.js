import React, { useState, useEffect } from 'react';

function ModeratorRating() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [moderator, setModerator] = useState(null);

  useEffect(() => {
    // Hole Moderator-Informationen
    fetch('http://localhost:5000/api/moderator-info')
      .then(res => res.json())
      .then(data => setModerator(data))
      .catch(err => console.error('Fehler beim Laden der Moderator-Info:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setFeedback({ type: 'error', message: 'Bitte wähle eine Bewertung aus.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('http://localhost:5000/api/moderator-rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setFeedback({ type: 'success', message: 'Vielen Dank für deine Bewertung des Moderators!' });
        setRating(0);
        setComment('');
      } else {
        setFeedback({ type: 'error', message: 'Fehler beim Senden der Bewertung.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Verbindungsfehler. Bitte versuche es später erneut.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stars = [1, 2, 3, 4, 5];

  if (!moderator) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-white/20 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="text-gray-300 mt-4">Lade Moderator-Informationen...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">🎙️ Moderator bewerten</h2>
      
      {/* Moderator-Info */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{moderator.name}</h3>
            <p className="text-gray-300">{moderator.show}</p>
          </div>
        </div>
      </div>

      <p className="text-gray-300 mb-6">
        Wie gefällt dir die Moderation? Dein Feedback hilft unseren Moderator:innen, sich ständig zu verbessern.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sterne-Bewertung */}
        <div>
          <label className="block text-white font-medium mb-3">Deine Bewertung</label>
          <div className="flex space-x-2">
            {stars.map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-4xl transition-all transform hover:scale-110 focus:outline-none"
              >
                <span className={star <= rating ? 'text-yellow-400' : 'text-gray-400'}>
                  {star <= rating ? '⭐' : '☆'}
                </span>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-gray-300 mt-2 text-sm">
              {rating === 1 && 'Sehr schlecht'}
              {rating === 2 && 'Schlecht'}
              {rating === 3 && 'Okay'}
              {rating === 4 && 'Gut'}
              {rating === 5 && 'Ausgezeichnet'}
            </p>
          )}
        </div>

        {/* Kommentar */}
        <div>
          <label htmlFor="comment" className="block text-white font-medium mb-3">
            Kommentar (optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Was gefällt dir an der Moderation? Was könnte verbessert werden?"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all resize-none"
            rows="4"
            maxLength="500"
          />
          <p className="text-gray-400 text-sm mt-1">
            {comment.length}/500 Zeichen
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
          disabled={isSubmitting || rating === 0}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? 'Wird gesendet...' : 'Bewertung abgeben'}
        </button>
      </form>

      <div className="mt-8 p-4 bg-white/5 rounded-lg">
        <h3 className="text-white font-semibold mb-2">💡 Feedback-Qualität</h3>
        <p className="text-gray-300 text-sm">
          Konstruktives Feedback ist besonders wertvoll. Erkläre bitte konkret, was dir gefallen hat 
          oder was verbessert werden könnte. Unsere Moderator:innen lesen jedes Feedback!
        </p>
      </div>
    </div>
  );
}

export default ModeratorRating;
