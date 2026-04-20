import React, { useState } from 'react';
import RadioApp from './RadioApp';
import ModeratorDashboard from './ModeratorDashboard';

function AppRouter() {
  const [isModerator, setIsModerator] = useState(false);

  // In einer echten Anwendung würde hier eine Authentifizierung stattfinden
  // Für Demo-Zwecke wechseln wir zwischen den Ansichten
  return (
    <div>
      {/* Demo-Switcher */}
      <div className="fixed top-2 right-2 z-50">
        <button
          onClick={() => setIsModerator(!isModerator)}
          className="px-3 py-1.5 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors text-xs md:text-sm"
        >
          {isModerator ? '👤 Hörer:innen Ansicht' : '🎙️ Moderator Ansicht'}
        </button>
      </div>
      
      {isModerator ? <ModeratorDashboard /> : <RadioApp />}
    </div>
  );
}

export default AppRouter;
