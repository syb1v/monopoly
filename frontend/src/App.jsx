import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MonopolyCard from './MonopolyCard';
import Dice3D from './Dice3D';
import { propertiesData, boardCells } from './data/cards';
import './App.css';

function App({ roomId, onLeave }) {
  const [gameState, setGameState] = useState({ players: {}, last_roll: null });
  const [visualPositions, setVisualPositions] = useState({});
  const [clientId] = useState(() => {
    const saved = localStorage.getItem('monopoly_client_id');
    if (saved) return saved;
    const id = Math.random().toString(36).substring(2, 9);
    localStorage.setItem('monopoly_client_id', id);
    return id;
  });
  const ws = useRef(null);
  const lastRollIdRef = useRef(null);
  const [isRolling, setIsRolling] = useState(false);
  const gameStateRef = useRef({ players: {} });
  const pendingFullStateRef = useRef(null);
  const logContainerRef = useRef(null);
  const [rollResult, setRollResult] = useState(null); // { d1, d2, total } for toast
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [boardScale, setBoardScale] = useState(1);

  // Resize handler for scaling board
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let newScale = 1;
      
      if (width <= 1024) {
        // Vertical mobile/tablet layout
        const availableWidth = width - 32; // 16px padding on each side
        if (availableWidth < 708) { // 700 + 8 border
          newScale = availableWidth / 708;
        }
      } else {
        // Desktop horizontal layout
        // Sidebar is ~300px + 40px gap + paddings
        const availableWidth = width - 340 - 80; 
        const availableHeight = height - 80;
        const availableSize = Math.min(availableWidth, availableHeight);
        if (availableSize < 708) {
          newScale = availableSize / 708;
        }
      }
      setBoardScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // trigger immediately
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Стейт для карточек
  const [selectedPropId, setSelectedPropId] = useState(null);

  // Вычисляем текущую выбранную карточку динамически, чтобы она всегда имела свежие данные из gameState
  const currentProp = selectedPropId
    ? {
        ...boardCells.find(c => c.id === selectedPropId),
        houses: gameState.properties?.[selectedPropId]?.houses || 0,
        mortgaged: gameState.properties?.[selectedPropId]?.mortgaged || false
      }
    : null;

  // Landing event from backend
  const landingEvent = gameState.landing_event && gameState.landing_event.for_player === clientId
    ? gameState.landing_event
    : null;

  const handleBuy = () => {
    if (!landingEvent) return;
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'BUY_PROPERTY',
        propertyId: landingEvent.cell_id,
        price: landingEvent.price,
      }));
    }
  };

  const handleDeclineBuy = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'DECLINE_BUY' }));
    }
  };

  const logEvent = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'LOG_EVENT', message }));
    }
  };

  const endTurn = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'END_TURN' }));
    }
  };

  const handleMortgage = (propertyId) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'MORTGAGE_PROPERTY', propertyId }));
    }
  };

  const handleUnmortgage = (propertyId) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'UNMORTGAGE_PROPERTY', propertyId }));
    }
  };

  const handleBuildHouse = (propertyId) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'BUILD_HOUSE', propertyId }));
    }
  };

  const handlePlaceBid = (amount) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'PLACE_BID', amount }));
    }
  };

  const handlePassBid = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'PASS_BID' }));
    }
  };

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/${roomId}/${clientId}`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'STATE_UPDATE') {
        const newRollId = data.state.last_roll?.id;
        if (newRollId && newRollId !== lastRollIdRef.current) {
          lastRollIdRef.current = newRollId;

          // 1) Capture old positions BEFORE any state change
          const oldPlayers = gameStateRef.current.players || {};
          const turnPlayerId = data.state.last_roll?.player_id || data.state.current_turn_player_id;
          const oldPos = oldPlayers[turnPlayerId]?.position ?? 0;
          const newPos = data.state.players[turnPlayerId]?.position ?? 0;
          let steps = newPos - oldPos;
          if (steps < 0) steps += 40;
          if (oldPos === newPos) steps = 0;

          // Save full state for later
          pendingFullStateRef.current = data.state;
          gameStateRef.current = data.state;

          // 2) Start dice rolling — keep old positions/modals/logs
          setIsRolling(true);
          setGameState(prev => ({
            ...data.state,
            players: prev.players,
            landing_event: null,
            logs: prev.logs,
          }));

          // 3) After 1.5s dice spin ends → start piece movement + show logs immediately
          setTimeout(() => {
            setIsRolling(false);

            // Show roll result toast
            const roll = data.state.last_roll;
            if (roll) {
              setRollResult({ d1: roll.dice1, d2: roll.dice2, total: roll.dice1 + roll.dice2 });
              setTimeout(() => setRollResult(null), 2500);
            }

            // Update positions so the piece starts moving — show logs now, keep modals hidden
            setGameState(prev => ({
              ...data.state,
              landing_event: null,
              // logs: show the new logs immediately after dice
            }));

            // 4) After piece finishes moving → show modals/landing event
            const moveDuration = steps * 200;
            setTimeout(() => {
              const fullState = pendingFullStateRef.current || data.state;
              setGameState(fullState);
              pendingFullStateRef.current = null;
            }, moveDuration + 300);
          }, 1500);

        } else {
          gameStateRef.current = data.state;
          setGameState(data.state);
        }
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [clientId]);

  // Логика поклеточного движения
  useEffect(() => {
    const players = gameState.players;
    if (!players) return;

    const interval = setInterval(() => {
      setVisualPositions((prev) => {
        const next = { ...prev };
        let moved = false;

        Object.entries(players).forEach(([id, data]) => {
          const targetPos = data.position;

          if (next[id] === undefined) {
            next[id] = targetPos;
            moved = true;
          } else if (next[id] !== targetPos) {
            next[id] = (next[id] + 1) % 40;
            moved = true;
          }
        });

        return moved ? next : prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [gameState.players]);

  // Auto-scroll logs to bottom whenever they update
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [gameState.logs]);

  const endGame = async () => {
    if (!confirm('Завершить игру? Весь прогресс будет утерян.')) return;
    try {
      await fetch(`http://localhost:8000/rooms/${roomId}`, { method: 'DELETE' });
    } catch (_) {}
    localStorage.removeItem('monopoly_room_id');
    if (ws.current) ws.current.close();
    onLeave();
  };

  const rollDice = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && !isRolling) {
      ws.current.send(JSON.stringify({ type: 'ROLL_DICE' }));
    }
  };



  const getGridArea = (index) => {
    if (index < 10) return `${11} / ${11 - index}`;
    if (index < 20) return `${21 - index} / 1`;
    if (index < 30) return `1 / ${index - 19}`;
    if (index < 40) return `${index - 29} / 11`;
    return '1 / 1';
  };

  const cells = boardCells;
  const players = gameState.players || {};
  const lastRoll = gameState.last_roll;

  return (
    <div className="app-global-wrapper">
      <div className="container">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1>Monopoly</h1>
            <div className="settings-wrapper">
              <button className="settings-btn" onClick={() => setSettingsOpen(o => !o)}>⚙️</button>
              {settingsOpen && (
                <div className="settings-dropdown">
                  <button className="settings-item danger" onClick={endGame}>
                    🛑 Завершить игру
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="client-id">ID: {clientId}</p>
          
          {gameState.current_turn_player_id === clientId ? (
            <div className="turn-indicator my-turn">Ваш ход!</div>
          ) : (
            <div className="turn-indicator waiting">Ожидание хода...</div>
          )}

          {gameState.current_turn_player_id === clientId && gameState.turn_phase === 'ACTION' ? (
            <button className="end-turn-btn" onClick={endTurn}>
              Завершить ход
            </button>
          ) : gameState.current_turn_player_id === clientId && gameState.players[clientId]?.jail_turns > 0 ? (
            <div className="jail-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="roll-btn" onClick={rollDice} disabled={isRolling}>
                {isRolling ? 'Бросаем...' : `Бросить дубль (${gameState.players[clientId].jail_turns} поп.)`}
              </button>
              <button className="modal-btn buy" onClick={() => {
                if (ws.current) ws.current.send(JSON.stringify({ type: 'PAY_JAIL_FINE' }));
              }} style={{ width: '100%', fontSize: '14px' }}>
                Заплатить $50
              </button>
              {gameState.players[clientId].jail_cards > 0 && (
                <button className="modal-btn" onClick={() => {
                  if (ws.current) ws.current.send(JSON.stringify({ type: 'USE_JAIL_CARD' }));
                }} style={{ width: '100%', fontSize: '14px', background: '#ffa500' }}>
                  Использовать карту
                </button>
              )}
            </div>
          ) : (
            <button 
              className="roll-btn" 
              onClick={rollDice} 
              disabled={isRolling || gameState.current_turn_player_id !== clientId}
            >
              {isRolling ? 'Бросаем...' : 'Бросить кубики'}
            </button>
          )}

          <div className="event-log-container">
            <h3>Чат событий</h3>
            <div className="event-log" ref={logContainerRef}>
              {gameState.logs && gameState.logs.map((log, i) => (
                <div key={i} className={`log-entry ${i === gameState.logs.length - 1 ? 'latest' : ''}`}>
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="players-list">
            {Object.entries(players).map(([id, data], idx) => (
              <div key={id} className={`player-info ${id === clientId ? 'me' : ''}`}>
                <div className="player-token" style={{ backgroundColor: `hsl(${idx * 137 % 360}, 70%, 50%)` }}></div>
                <div>
                  <strong>{id === clientId ? 'Ты' : data.name || `Игрок ${id.substring(0, 4)}`}</strong>
                  <div className="balance">${data.balance}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Инвентарь: моя недвижимость */}
          {(() => {
            const myProps = boardCells
              .filter(c => gameState.properties && gameState.properties[c.id]?.owner_id === clientId)
              .map(c => ({
                ...c,
                houses: gameState.properties[c.id].houses || 0,
                mortgaged: gameState.properties[c.id].mortgaged || false
              }));
            if (myProps.length === 0) return null;
            return (
              <div className="inventory">
                <h3>Моя недвижимость</h3>
                <div className="inventory-list">
                  {myProps.map(p => (
                    <div key={p.id} className="inventory-item" onClick={() => setSelectedPropId(p.id)}>
                      {p.color && <span className="inv-color" style={{ backgroundColor: p.color }}></span>}
                      {p.type === 'railroad' && <span className="inv-icon">🚂</span>}
                      {p.type === 'utility' && <span className="inv-icon">{p.id === 'prop_12' ? '💡' : '🚰'}</span>}
                      <span className="inv-name" style={{ textDecoration: p.mortgaged ? 'line-through' : 'none', opacity: p.mortgaged ? 0.5 : 1 }}>{p.name}</span>
                      {p.houses > 0 && <span className="inv-icon" style={{ marginLeft: 5 }}>{p.houses === 5 ? '🏨' : '🏠'.repeat(p.houses)}</span>}
                      <span className="inv-hint">ℹ️</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        <div className="board-wrapper" style={{ 
          width: 708 * boardScale, 
          height: 708 * boardScale,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div className="board-scaler" style={{ 
            transform: `scale(${boardScale})`, 
            transformOrigin: 'center center',
            width: 708,
            height: 708,
            display: 'flex'
          }}>
            <div className="monopoly-board">
              <div className="board-center">
              <div className="board-deck deck-chance">
                <h3>Шанс</h3>
              </div>
              <div className="board-deck deck-chest">
                <h3>Общественная Казна</h3>
              </div>

              {/* Модал: карточка из инвентаря */}
              <AnimatePresence>
                {currentProp && (
                  <motion.div
                    className="card-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedPropId(null)}
                  >
                    <motion.div
                      className="prop-card-modal"
                      initial={{ scale: 0.6, y: 40 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ type: 'spring', damping: 15 }}
                      onClick={e => e.stopPropagation()}
                    >
                      <MonopolyCard property={currentProp} />
                      <div className="prop-actions" style={{ display: 'flex', gap: '8px', width: '100%', flexDirection: 'column' }}>
                        {currentProp.type === 'street' && currentProp.houses < 5 && !currentProp.mortgaged && (
                          <button className="modal-btn buy" onClick={() => handleBuildHouse(currentProp.id)}>
                            Построить ({currentProp.houses === 4 ? 'Отель' : 'Дом'} за ${currentProp.houseCost})
                          </button>
                        )}
                        {currentProp.mortgaged ? (
                          <button className="modal-btn buy" onClick={() => handleUnmortgage(currentProp.id)}>
                            Выкупить за ${Math.floor(currentProp.mortgageValue * 1.1)}
                          </button>
                        ) : (
                          <button className="modal-btn decline" onClick={() => handleMortgage(currentProp.id)}>
                            Заложить за ${currentProp.mortgageValue}
                          </button>
                        )}
                        <button className="prop-card-close" style={{ marginTop: '8px' }} onClick={() => setSelectedPropId(null)}>✕ Закрыть</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <h2 className="logo-text">MONOPOLY</h2>
              {lastRoll && (
                <Dice3D 
                  dice1={lastRoll.dice1} 
                  dice2={lastRoll.dice2} 
                  isRolling={isRolling} 
                />
              )}

              {/* Roll result toast */}
              <AnimatePresence>
                {rollResult && (
                  <motion.div
                    className="roll-result-toast"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ type: 'spring', damping: 14, stiffness: 200 }}
                  >
                    <span className="roll-result-dice">{rollResult.d1} + {rollResult.d2}</span>
                    <span className="roll-result-total">{rollResult.total}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {gameState.auction_state && (
                  <motion.div
                    className="card-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="drawn-card buy-offer"
                      initial={{ scale: 0.5, y: -60 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: 'spring', damping: 15 }}
                    >
                      <h2>Аукцион!</h2>
                      <p>Лот: <strong>{gameState.auction_state.cell_name}</strong></p>
                      
                      <div className="auction-info" style={{ margin: '15px 0', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
                        <p>Текущая ставка: <strong style={{color: 'green'}}>${gameState.auction_state.highest_bid}</strong></p>
                        <p>Лидер: {gameState.auction_state.highest_bidder ? (gameState.players[gameState.auction_state.highest_bidder]?.name || 'Игрок') : 'Нет'}</p>
                      </div>

                      {gameState.auction_state.active_players[gameState.auction_state.turn_idx] === clientId ? (
                        <div className="modal-actions" style={{ flexDirection: 'column', gap: '10px' }}>
                          <p style={{ color: 'red', fontWeight: 'bold' }}>Ваш ход!</p>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              className="modal-btn buy" 
                              onClick={() => handlePlaceBid(gameState.auction_state.highest_bid + 10)}
                              disabled={gameState.players[clientId]?.balance < gameState.auction_state.highest_bid + 10}
                            >
                              Ставка: ${gameState.auction_state.highest_bid + 10}
                            </button>
                            <button className="modal-btn decline" onClick={handlePassBid}>Пас</button>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              className="modal-btn buy" 
                              style={{ background: '#4CAF50' }}
                              onClick={() => handlePlaceBid(gameState.auction_state.highest_bid + 50)}
                              disabled={gameState.players[clientId]?.balance < gameState.auction_state.highest_bid + 50}
                            >
                              + $50
                            </button>
                            <button 
                              className="modal-btn buy" 
                              style={{ background: '#2E7D32' }}
                              onClick={() => handlePlaceBid(gameState.auction_state.highest_bid + 100)}
                              disabled={gameState.players[clientId]?.balance < gameState.auction_state.highest_bid + 100}
                            >
                              + $100
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p>Ожидание хода: {gameState.players[gameState.auction_state.active_players[gameState.auction_state.turn_idx]]?.name || 'Игрок'}</p>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {landingEvent && landingEvent.action === 'draw_card' && (
                  <motion.div 
                    className="card-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div 
                      className={`drawn-card ${landingEvent.type}-theme`}
                      initial={{ scale: 0.5, rotateY: 90 }}
                      animate={{ scale: 1, rotateY: 0 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: 'spring', damping: 15 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2>{landingEvent.type === 'chance' ? 'Шанс' : 'Общественная Казна'}</h2>
                      <p>{landingEvent.card.text}</p>
                      <button onClick={() => {
                        // The card is informational, the backend already applied the effect.
                        // We can clear it to let the player end turn or buy property.
                        setGameState(prev => ({...prev, landing_event: null}));
                      }}>ОК</button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Landing modal: buy offer */}
              <AnimatePresence>
                {landingEvent && landingEvent.action === 'buy' && (
                  <motion.div
                    className="card-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="drawn-card buy-offer"
                      initial={{ scale: 0.5, y: 60 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: 'spring', damping: 15 }}
                    >
                      <h2>Свободная клетка!</h2>
                      <p>«{landingEvent.cell_name}»</p>
                      <p className="price-tag">Цена: ${landingEvent.price}</p>
                      <div className="modal-actions">
                        <button className="modal-btn buy" onClick={handleBuy}>Купить</button>
                        <button className="modal-btn decline" onClick={handleDeclineBuy}>Отказаться</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {cells.map((cell, cellIndex) => {
              const playersOnCell = Object.keys(visualPositions).filter(
                (id) => visualPositions[id] === cellIndex
              );

              let cellType = "property";
              if (cellIndex === 0) cellType = "corner go";
              else if (cellIndex === 10) cellType = "corner jail";
              else if (cellIndex === 20) cellType = "corner parking";
              else if (cellIndex === 30) cellType = "corner police";
              
              let directionClass = "";
              if (cellIndex > 0 && cellIndex < 10) directionClass = "cell-bottom";
              else if (cellIndex > 10 && cellIndex < 20) directionClass = "cell-left";
              else if (cellIndex > 20 && cellIndex < 30) directionClass = "cell-top";
              else if (cellIndex > 30 && cellIndex < 40) directionClass = "cell-right";
              else directionClass = `cell-${cellIndex}`;

              return (
                <div key={cellIndex} className={`cell ${cellType} ${directionClass}`} style={{ gridArea: getGridArea(cellIndex) }}>
                  <span className="cell-number">{cellIndex}</span>
                  <div className="cell-content">
                    {cell.type === 'street' && (
                      <div className="property-header" style={{ backgroundColor: cell.color, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {gameState.properties && gameState.properties[cell.id]?.houses > 0 && (
                          <span style={{ fontSize: '8px' }}>
                            {gameState.properties[cell.id].houses === 5 ? '🏨' : '🏠'.repeat(gameState.properties[cell.id].houses)}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {gameState.properties && gameState.properties[cell.id]?.mortgaged && (
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'red', fontSize: '24px', fontWeight: 'bold' }}>
                        ЗАЛОГ
                      </div>
                    )}
                    
                    {cell.type === 'railroad' && <div className="cell-icon">🚂</div>}
                    {cell.type === 'utility' && cell.id === 'prop_12' && <div className="cell-icon">💡</div>}
                    {cell.type === 'utility' && cell.id === 'prop_28' && <div className="cell-icon">🚰</div>}
                    {cell.type === 'chance' && <div className="cell-icon">❓</div>}
                    {cell.type === 'chest' && <div className="cell-icon">🎁</div>}
                    {cell.type === 'tax' && <div className="cell-icon">💎</div>}
                    
                    <div className="cell-name">{cell.name}</div>
                    
                    {cell.price && (
                      <div className="cell-price">${cell.price}</div>
                    )}
                  </div>

                  <div className="tokens-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {playersOnCell.map((id) => {
                      const playerIndex = Object.keys(players).indexOf(id);
                      return (
                        <motion.div
                          key={id}
                          layoutId={`token-${id}`}
                          className="token"
                          title={id}
                          style={{ backgroundColor: `hsl(${playerIndex * 137 % 360}, 70%, 50%)` }}
                          transition={{ duration: 0.15 }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;