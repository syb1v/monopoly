import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Lobby from './Lobby.jsx';

function Root() {
  const [roomId, setRoomId] = useState(() => localStorage.getItem('monopoly_room_id') || null);

  const handleJoin = (id) => {
    localStorage.setItem('monopoly_room_id', id);
    setRoomId(id);
  };

  const handleLeave = () => {
    localStorage.removeItem('monopoly_room_id');
    setRoomId(null);
  };

  if (!roomId) {
    return <Lobby onJoin={handleJoin} />;
  }

  return <App roomId={roomId} onLeave={handleLeave} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);