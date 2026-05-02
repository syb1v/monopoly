import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MonopolyCard from './MonopolyCard';
import Dice3D from './Dice3D';
import { boardCells } from './data/cards';
import './MobileApp.css';

export default function MobileApp({
  gameState, setGameState, clientId, ws, isRolling, rollResult,
  rollDice, endTurn, handleBuy, handleDeclineBuy,
  handleMortgage, handleUnmortgage, handleBuildHouse,
  handlePlaceBid, handlePassBid, endGame, showErrorToast,
  balanceToasts, visualPositions, logContainerRef,
  instructionsOpen, setInstructionsOpen,
  clickedCell, clickedCellId, setClickedCellId,
  selectedPlayerId, setSelectedPlayerId,
  gameElapsed, formatTime,
}) {
  const [activeTab, setActiveTab] = useState('board');
  const [selectedPropId, setSelectedPropId] = useState(null);
  const boardRef = useRef(null);

  const players = gameState.players || {};
  const lastRoll = gameState.last_roll;
  const landingEvent = gameState.landing_event?.for_player === clientId ? gameState.landing_event : null;
  const myPlayer = players[clientId];
  const isMyTurn = gameState.current_turn_player_id === clientId;
  const inJail = (myPlayer?.jail_turns || 0) > 0;

  // Badge logic: highlight action tab when action required
  const needsAction = isMyTurn && (
    landingEvent ||
    gameState.auction_state ||
    gameState.turn_phase === 'ACTION' ||
    gameState.turn_phase === 'ROLL'
  );

  // Auto-switch to action tab when it's our turn and we need to act
  useEffect(() => {
    if (needsAction && activeTab === 'board') {
      // Don't auto-switch — let user decide
    }
  }, [needsAction]);

  const currentProp = selectedPropId
    ? {
        ...boardCells.find(c => c.id === selectedPropId),
        houses: gameState.properties?.[selectedPropId]?.houses || 0,
        mortgaged: gameState.properties?.[selectedPropId]?.mortgaged || false,
      }
    : null;

  const myProps = boardCells
    .filter(c => gameState.properties?.[c.id]?.owner_id === clientId)
    .map(c => ({
      ...c,
      houses: gameState.properties[c.id].houses || 0,
      mortgaged: gameState.properties[c.id].mortgaged || false,
    }));

  const getGridArea = (index) => {
    if (index < 10) return `${11} / ${11 - index}`;
    if (index < 20) return `${21 - index} / 1`;
    if (index < 30) return `1 / ${index - 19}`;
    if (index < 40) return `${index - 29} / 11`;
    return '1 / 1';
  };

  // ─── BOARD TAB ─────────────────────────────────────────────────────────────
  const BoardTab = () => (
    <div className="mob-board-tab">
      <div className="mob-board-scroll" ref={boardRef}>
        <div className="mob-board-inner">
          <div className="monopoly-board">
            <div className="board-center">
              <div className="board-deck deck-chance"><h3>Шанс</h3></div>
              <div className="board-deck deck-chest"><h3>Общественная Казна</h3></div>
              <h2 className="logo-text">MONOPOLY</h2>
              {lastRoll && (
                <Dice3D dice1={lastRoll.dice1} dice2={lastRoll.dice2} isRolling={isRolling} />
              )}
              <AnimatePresence>
                {rollResult && (
                  <motion.div
                    className="roll-result-toast"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ type: 'spring', damping: 14 }}
                  >
                    <span className="roll-result-dice">{rollResult.d1} + {rollResult.d2}</span>
                    <span className="roll-result-total">{rollResult.total}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {boardCells.map((cell, cellIndex) => {
              const playersOnCell = Object.keys(visualPositions).filter(id => visualPositions[id] === cellIndex);
              let cellType = 'property';
              if (cellIndex === 0) cellType = 'corner go';
              else if (cellIndex === 10) cellType = 'corner jail';
              else if (cellIndex === 20) cellType = 'corner parking';
              else if (cellIndex === 30) cellType = 'corner police';

              let directionClass = '';
              if (cellIndex > 0 && cellIndex < 10) directionClass = 'cell-bottom';
              else if (cellIndex > 10 && cellIndex < 20) directionClass = 'cell-left';
              else if (cellIndex > 20 && cellIndex < 30) directionClass = 'cell-top';
              else if (cellIndex > 30 && cellIndex < 40) directionClass = 'cell-right';
              else directionClass = `cell-${cellIndex}`;

              return (
                <div
                  key={cellIndex}
                  className={`cell ${cellType} ${directionClass}`}
                  style={{ gridArea: getGridArea(cellIndex), cursor: cell.id ? 'pointer' : 'default' }}
                  onClick={() => cell.id && setClickedCellId(cell.id)}
                >
                  <span className="cell-number">{cellIndex}</span>
                  <div className="cell-content">
                    {cell.type === 'street' && (
                      <div className="property-header" style={{ backgroundColor: cell.color, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {gameState.properties?.[cell.id]?.houses > 0 && (
                          <span style={{ fontSize: '8px' }}>
                            {gameState.properties[cell.id].houses === 5 ? '🏨' : '🏠'.repeat(gameState.properties[cell.id].houses)}
                          </span>
                        )}
                      </div>
                    )}
                    {gameState.properties?.[cell.id]?.mortgaged && (
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'red', fontSize: '24px', fontWeight: 'bold' }}>ЗАЛОГ</div>
                    )}
                    {cell.type === 'railroad' && <div className="cell-icon">🚂</div>}
                    {cell.type === 'utility' && cell.id === 'prop_12' && <div className="cell-icon">💡</div>}
                    {cell.type === 'utility' && cell.id === 'prop_28' && <div className="cell-icon">🚰</div>}
                    {cell.type === 'chance' && <div className="cell-icon">❓</div>}
                    {cell.type === 'chest' && <div className="cell-icon">🎁</div>}
                    {cell.type === 'tax' && <div className="cell-icon">💎</div>}
                    <div className="cell-name">{cell.name}</div>
                    {cell.price && <div className="cell-price">${cell.price}</div>}
                  </div>
                  <div className="tokens-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {playersOnCell.map((id) => {
                      const playerIndex = Object.keys(players).indexOf(id);
                      return (
                        <motion.div
                          key={id}
                          layoutId={`token-${id}`}
                          className="token"
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
      <div className="mob-board-hint">↔ Прокрути или щипни для зума</div>
    </div>
  );

  // ─── ACTIONS TAB ────────────────────────────────────────────────────────────
  const ActionsTab = () => (
    <div className="mob-actions-tab">
      {/* Turn indicator */}
      <div className={`mob-turn-card ${isMyTurn ? 'my-turn' : 'waiting'}`}>
        {isMyTurn ? '🎲 Ваш ход!' : `⏳ Ход: ${players[gameState.current_turn_player_id]?.name || '...'}`}
      </div>

      {/* Modals: drawn card */}
      <AnimatePresence>
        {landingEvent?.action === 'draw_card' && (
          <motion.div
            className={`mob-card-block ${landingEvent.type}-theme`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <h3>{landingEvent.type === 'chance' ? '❓ Шанс' : '🎁 Общественная Казна'}</h3>
            <p>{landingEvent.card.text}</p>
            <button className="mob-btn primary" onClick={() => {
              setGameState(prev => ({ ...prev, landing_event: null }));
            }}>OK</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals: buy offer */}
      <AnimatePresence>
        {landingEvent?.action === 'buy' && (
          <motion.div
            className="mob-card-block buy-offer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <h3>🏠 Свободная клетка!</h3>
            <p className="mob-prop-name">«{landingEvent.cell_name}»</p>
            <p className="mob-price-tag">💰 ${landingEvent.price}</p>
            <div className="mob-btn-row">
              <button className="mob-btn buy" onClick={handleBuy}>Купить</button>
              <button className="mob-btn decline" onClick={handleDeclineBuy}>Отказаться</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auction */}
      <AnimatePresence>
        {gameState.auction_state && (
          <motion.div className="mob-card-block auction" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h3>🔨 Аукцион</h3>
            <p>Лот: <strong>{gameState.auction_state.cell_name}</strong></p>
            <p>Текущая ставка: <strong style={{ color: '#4CAF50' }}>${gameState.auction_state.highest_bid}</strong></p>
            <p>Лидер: {gameState.auction_state.highest_bidder ? (players[gameState.auction_state.highest_bidder]?.name || 'Игрок') : 'Нет'}</p>
            {gameState.auction_state.active_players[gameState.auction_state.turn_idx] === clientId ? (
              <div className="mob-auction-btns">
                <p style={{ color: '#ff5722', fontWeight: 'bold' }}>Ваш ход!</p>
                <div className="mob-btn-row">
                  <button className="mob-btn buy" onClick={() => handlePlaceBid(gameState.auction_state.highest_bid + 10)}
                    disabled={myPlayer?.balance < gameState.auction_state.highest_bid + 10}>
                    ${gameState.auction_state.highest_bid + 10}
                  </button>
                  <button className="mob-btn buy" style={{ background: '#4CAF50' }} onClick={() => handlePlaceBid(gameState.auction_state.highest_bid + 50)}
                    disabled={myPlayer?.balance < gameState.auction_state.highest_bid + 50}>
                    +$50
                  </button>
                  <button className="mob-btn buy" style={{ background: '#2E7D32' }} onClick={() => handlePlaceBid(gameState.auction_state.highest_bid + 100)}
                    disabled={myPlayer?.balance < gameState.auction_state.highest_bid + 100}>
                    +$100
                  </button>
                </div>
                <button className="mob-btn decline" onClick={handlePassBid}>Пас</button>
              </div>
            ) : (
              <p style={{ opacity: 0.7 }}>Ожидание: {players[gameState.auction_state.active_players[gameState.auction_state.turn_idx]]?.name || '...'}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main action button */}
      {isMyTurn && !landingEvent && !gameState.auction_state && (
        <>
          {gameState.turn_phase === 'ACTION' && (
            <button className="mob-btn primary large" onClick={endTurn}>✅ Завершить ход</button>
          )}
          {gameState.turn_phase === 'ROLL' && inJail && (
            <div className="mob-jail-block">
              <p className="mob-jail-title">🚓 Вы в тюрьме ({myPlayer.jail_turns} поп.)</p>
              <button className="mob-btn primary large" onClick={rollDice} disabled={isRolling}>
                {isRolling ? 'Бросаем...' : 'Бросить дубль'}
              </button>
              <button className="mob-btn secondary" onClick={() => ws.current?.send(JSON.stringify({ type: 'PAY_JAIL_FINE' }))}>
                Заплатить $50
              </button>
              {(myPlayer?.jail_cards || 0) > 0 && (
                <button className="mob-btn secondary" style={{ background: '#ffa500' }} onClick={() => ws.current?.send(JSON.stringify({ type: 'USE_JAIL_CARD' }))}>
                  Использовать карту
                </button>
              )}
            </div>
          )}
          {gameState.turn_phase === 'ROLL' && !inJail && (
            <button className="mob-btn primary large roll" onClick={rollDice} disabled={isRolling}>
              {isRolling ? '🎲 Бросаем...' : '🎲 Бросить кубики'}
            </button>
          )}
        </>
      )}

      {/* Players scoreboard */}
      <div className="mob-scoreboard">
        <h4>Игроки</h4>
        {Object.entries(players).map(([id, data], idx) => (
          <div key={id} className={`mob-player-row ${id === clientId ? 'me' : ''}`}
            onClick={() => setSelectedPlayerId(id)}
          >
            <div className="mob-player-token" style={{ backgroundColor: `hsl(${idx * 137 % 360}, 70%, 50%)` }} />
            <div className="mob-player-info">
              <span className="mob-player-name">
                {id === clientId ? 'Ты' : data.name}
                {id === gameState.current_turn_player_id && ' 🎲'}
                {(data.jail_turns || 0) > 0 && ' 🚓'}
              </span>
              <span className="mob-player-balance">${data.balance}</span>
            </div>
            <div style={{ position: 'relative' }}>
              <AnimatePresence>
                {balanceToasts[id]?.map(toast => (
                  <motion.div
                    key={toast.id}
                    className={`balance-toast ${toast.amount > 0 ? 'positive' : 'negative'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -20 }}
                    exit={{ opacity: 0, y: -35 }}
                  >
                    {toast.amount > 0 ? '+' : ''}{toast.amount}$
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Game Stats Block */}
      {(() => {
        const totalProps = Object.keys(gameState.properties || {}).length;
        const totalTurns = Object.values(players).reduce((s, p) => s + (p.stats?.turns_played || 0), 0);
        const totalSpent = Object.values(players).reduce((s, p) => s + (p.stats?.money_spent || 0), 0);
        const richest = Object.entries(players).sort(([,a],[,b]) => b.balance - a.balance)[0];
        return (
          <div className="game-stats-block mob-stats">
            <h4>📊 Статистика</h4>
            <div className="mob-stats-grid">
              <div className="mob-stat-item"><span>⏱ Время</span><strong>{formatTime(gameElapsed)}</strong></div>
              <div className="mob-stat-item"><span>🎲 Ходов</span><strong>{totalTurns}</strong></div>
              <div className="mob-stat-item"><span>💸 Слито</span><strong>${totalSpent}</strong></div>
              <div className="mob-stat-item"><span>💰 Богач</span><strong>{richest ? richest[1].name : '—'}</strong></div>
            </div>
          </div>
        );
      })()}
    </div>
  );

  // ─── PROPERTIES TAB ─────────────────────────────────────────────────────────
  const PropertiesTab = () => (
    <div className="mob-props-tab">
      {myProps.length === 0 ? (
        <div className="mob-empty-state">
          <span>🏚️</span>
          <p>У вас пока нет недвижимости</p>
        </div>
      ) : (
        <div className="mob-props-grid">
          {myProps.map(p => (
            <div key={p.id} className={`mob-prop-item ${p.mortgaged ? 'mortgaged' : ''}`} onClick={() => setSelectedPropId(p.id)}>
              {p.color && <div className="mob-prop-color" style={{ backgroundColor: p.color }} />}
              {p.type === 'railroad' && <div className="mob-prop-color" style={{ backgroundColor: '#333' }}>🚂</div>}
              {p.type === 'utility' && <div className="mob-prop-color" style={{ backgroundColor: '#555' }}>{p.id === 'prop_12' ? '💡' : '🚰'}</div>}
              <div className="mob-prop-details">
                <span className="mob-prop-name">{p.name}</span>
                {p.mortgaged && <span className="mob-mortgaged-badge">ЗАЛОГ</span>}
                {p.houses > 0 && <span className="mob-houses">{p.houses === 5 ? '🏨' : '🏠'.repeat(p.houses)}</span>}
              </div>
              <span className="mob-prop-hint">›</span>
            </div>
          ))}
        </div>
      )}

      {/* Property card modal */}
      <AnimatePresence>
        {currentProp && (
          <motion.div className="card-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPropId(null)}>
            <motion.div className="prop-card-modal" initial={{ scale: 0.7, y: 60 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ type: 'spring', damping: 15 }} onClick={e => e.stopPropagation()}>
              <MonopolyCard property={currentProp} />
              <div className="prop-actions" style={{ display: 'flex', gap: '8px', width: '100%', flexDirection: 'column' }}>
                {currentProp.type === 'street' && currentProp.houses < 5 && !currentProp.mortgaged && (
                  <button className="modal-btn buy" onClick={() => { handleBuildHouse(currentProp.id); setSelectedPropId(null); }}>
                    Построить ({currentProp.houses === 4 ? 'Отель' : 'Дом'} за ${currentProp.houseCost})
                  </button>
                )}
                {currentProp.mortgaged ? (
                  <button className="modal-btn buy" onClick={() => { handleUnmortgage(currentProp.id); setSelectedPropId(null); }}>
                    Выкупить за ${Math.floor(currentProp.mortgageValue * 1.1)}
                  </button>
                ) : (
                  <button className="modal-btn decline" onClick={() => { handleMortgage(currentProp.id); setSelectedPropId(null); }}>
                    Заложить за ${currentProp.mortgageValue}
                  </button>
                )}
                <button className="prop-card-close" onClick={() => setSelectedPropId(null)}>✕ Закрыть</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ─── LOG TAB ────────────────────────────────────────────────────────────────
  const LogTab = () => (
    <div className="mob-log-tab">
      <div className="mob-log-scroll" ref={logContainerRef}>
        {gameState.logs?.map((log, i) => (
          <div key={i} className={`log-entry ${i === gameState.logs.length - 1 ? 'latest' : ''}`}>{log}</div>
        ))}
      </div>
    </div>
  );

  // ─── INSTRUCTIONS ────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'board', icon: '🗺️', label: 'Доска' },
    { id: 'action', icon: '🎮', label: 'Ход', badge: needsAction },
    { id: 'props', icon: '🏘️', label: 'Имущество' },
    { id: 'log', icon: '📋', label: 'Лог' },
  ];

  return (
    <div className="mob-wrapper">
      {/* Header */}
      <div className="mob-header">
        <span className="mob-header-title">MONOPOLY</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="mob-icon-btn" onClick={() => setInstructionsOpen(true)}>📖</button>
          <button className="mob-icon-btn danger" onClick={endGame}>🛑</button>
        </div>
      </div>

      {/* Content */}
      <div className="mob-content">
        <AnimatePresence mode="wait">
          {activeTab === 'board' && <motion.div key="board" className="mob-tab-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><BoardTab /></motion.div>}
          {activeTab === 'action' && <motion.div key="action" className="mob-tab-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ActionsTab /></motion.div>}
          {activeTab === 'props' && <motion.div key="props" className="mob-tab-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PropertiesTab /></motion.div>}
          {activeTab === 'log' && <motion.div key="log" className="mob-tab-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LogTab /></motion.div>}
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <nav className="mob-bottom-nav">
        {tabs.map(tab => (
          <button key={tab.id} className={`mob-tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <span className="mob-tab-icon">{tab.icon}</span>
            {tab.badge && <span className="mob-tab-badge" />}
            <span className="mob-tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Cell Info Popup ── */}
      <AnimatePresence>
        {clickedCell && (
          <motion.div className="card-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setClickedCellId(null)} style={{ zIndex: 3000 }}>
            <motion.div className="cell-info-popup card-mode" initial={{ scale: 0.75, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.75, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <div className="popup-card-wrapper">
                <MonopolyCard property={{
                  ...clickedCell,
                  houses: clickedCell.propState?.houses || 0,
                  mortgaged: clickedCell.propState?.mortgaged || false
                }} />
                {!clickedCell.propState?.owner_id && (
                  <button className="prop-card-close floating" onClick={() => setClickedCellId(null)}>✕</button>
                )}
              </div>
              
              {clickedCell.propState?.owner_id && (
                <div className="cell-popup-footer">
                  <div className="cell-popup-owner">
                    {(() => {
                      const ownerId = clickedCell.propState.owner_id;
                      const owner = players[ownerId];
                      const ownerIdx = Object.keys(players).indexOf(ownerId);
                      return (
                        <>
                          <div className="owner-token" style={{ backgroundColor: `hsl(${ownerIdx * 137 % 360}, 70%, 50%)` }} />
                          <span>Владелец: <strong>{ownerId === clientId ? 'Вы' : owner?.name}</strong></span>
                        </>
                      );
                    })()}
                  </div>
                  <button className="mob-btn secondary small" onClick={() => setClickedCellId(null)}>Закрыть</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Player Profile Modal ── */}
      <AnimatePresence>
        {selectedPlayerId && (() => {
          const p = players[selectedPlayerId];
          if (!p) return null;
          const pIdx = Object.keys(players).indexOf(selectedPlayerId);
          const pProps = boardCells.filter(c => gameState.properties?.[c.id]?.owner_id === selectedPlayerId).map(c => ({ ...c, ...gameState.properties[c.id] }));
          return (
            <motion.div className="card-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPlayerId(null)} style={{ zIndex: 3000 }}>
              <motion.div className="player-profile-modal" initial={{ scale: 0.75, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.75, opacity: 0 }} onClick={e => e.stopPropagation()}>
                <div className="profile-header">
                  <div className="profile-token" style={{ backgroundColor: `hsl(${pIdx * 137 % 360}, 70%, 50%)` }} />
                  <div><h2>{selectedPlayerId === clientId ? 'Вы' : p.name}</h2><span className="profile-sub">{p.balance}$</span></div>
                  <button className="prop-card-close" onClick={() => setSelectedPlayerId(null)}>✕</button>
                </div>
                <div className="profile-stats">
                  <div className="pstat"><span>🏘️ Участков</span><strong>{pProps.length}</strong></div>
                  <div className="pstat"><span>💰 Баланс</span><strong>${p.balance}</strong></div>
                </div>
                <div className="profile-stats-detailed-mob" style={{ padding: '8px 14px', fontSize: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', opacity: 0.8 }}>
                  <div>🎲 Ходов: {p.stats?.turns_played || 0}</div>
                  <div>💸 Слито: ${p.stats?.money_spent || 0}</div>
                  <div>🃏 Карт: {p.stats?.cards_drawn || 0}</div>
                  <div>🚓 Штрафы: ${p.stats?.fines_paid || 0}</div>
                </div>
                {pProps.length > 0 && (
                  <div className="profile-props">
                    {pProps.map(pr => (
                      <div key={pr.id} className="profile-prop-row">
                        {pr.color && <span className="pprop-color" style={{ backgroundColor: pr.color }} />}
                        <span style={{ flex: 1 }}>{pr.name}</span>
                        {pr.houses > 0 && <span>{pr.houses === 5 ? '🏨' : '🏠'.repeat(pr.houses)}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Instructions modal */}
      <AnimatePresence>
        {instructionsOpen && (
          <motion.div className="card-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setInstructionsOpen(false)} style={{ zIndex: 3000 }}>
            <motion.div className="instructions-modal" initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <div className="instructions-header">
                <h2>📖 Правила Monopoly</h2>
                <button className="prop-card-close" onClick={() => setInstructionsOpen(false)}>✕</button>
              </div>
              <div className="instructions-content">
                <h3>Цель игры</h3>
                <p>Остаться единственным игроком, не ставшим банкротом.</p>
                <h3>Покупка недвижимости</h3>
                <p>При посадке на свободный участок — купи или откажись (тогда аукцион).</p>
                <h3>Монополии и Строительство</h3>
                <p>Собери все участки одного цвета → строй дома равномерно (max 4) → затем отель.</p>
                <h3>Залог</h3>
                <p>Заложи незастроенную собственность за 50% стоимости. Выкуп — 110%.</p>
                <h3>Тюрьма</h3>
                <p>Выйти: дубль (3 попытки), штраф $50 или карта освобождения.</p>
                <h3>Аукционы</h3>
                <p>Отказался от покупки — участок уходит с молотка всем игрокам.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
