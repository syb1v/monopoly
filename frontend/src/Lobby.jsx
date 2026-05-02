import { useState, useEffect } from 'react';
import { IconDice } from './Icons';
import './Lobby.css';

export default function Lobby({ onJoin }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('monopoly_player_name') || '');

  const fetchRooms = async () => {
    try {
      const res = await fetch(`http://${window.location.hostname}:8000/rooms`);
      const data = await res.json();
      setRooms(data);
    } catch (_) {}
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async () => {
    if (!playerName.trim()) {
      alert('Пожалуйста, введите ваше имя!');
      return;
    }
    localStorage.setItem('monopoly_player_name', playerName.trim());
    setLoading(true);
    try {
      const res = await fetch(`http://${window.location.hostname}:8000/rooms`, { method: 'POST' });
      const room = await res.json();
      onJoin(room.id);
    } catch (_) {
      alert('Не удалось создать игру. Проверьте, запущен ли сервер.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = (roomId) => {
    if (!playerName.trim()) {
      alert('Пожалуйста, введите ваше имя!');
      return;
    }
    localStorage.setItem('monopoly_player_name', playerName.trim());
    onJoin(roomId);
  };

  return (
    <div className="lobby-wrapper">
      <div className="lobby-card">
        <div className="lobby-logo">
          <span className="lobby-logo-icon"><IconDice size={48} color="#4caf50"/></span>
          <h1>MONOPOLY</h1>
          <p className="lobby-subtitle">Классическая игра в новом формате</p>
        </div>

        <div className="lobby-name-input">
          <input 
            type="text" 
            placeholder="Ваш никнейм..." 
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={15}
          />
        </div>

        <button className="lobby-start-btn" onClick={handleCreate} disabled={loading || !playerName.trim()}>
          {loading ? 'Создаём игру...' : '+ Начать новую игру'}
        </button>

        {rooms.length > 0 && (
          <div className="lobby-rooms">
            <h3>Активные игры</h3>
            <div className="rooms-list">
              {rooms.map(room => (
                <div key={room.id} className="room-item" onClick={() => handleJoin(room.id)}>
                  <span className="room-name">{room.name}</span>
                  <span className="room-join">Войти →</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
