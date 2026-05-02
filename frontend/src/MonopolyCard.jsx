import React from 'react';
import './MonopolyCard.css';

export default function MonopolyCard({ property }) {
  const renderBack = () => (
    <div className="card-back">
      <h2>{property.name}</h2>
      <div className="mortgage-text">ЗАЛОГ</div>
      <div className="buyback-cost">Выкуп: ${Math.floor(property.mortgageValue * 1.1)}</div>
    </div>
  );

  if (property.type === 'street') {
    return (
      <div className={`monopoly-card ${property.mortgaged ? 'is-flipped' : ''}`}>
        <div className="card-inner">
          <div className="card-front">
        <div
          className="card-header"
          style={{ backgroundColor: property.color }}
        >
          <span className="card-subtitle">Договор о праве собственности</span>
          <h2 className="card-title">{property.name}</h2>
        </div>

        <div className="card-body">
          <p className="rent-base">АРЕНДНАЯ ПЛАТА: ${property.rent[0]}</p>

          <ul className="rent-list">
            <li>С 1 домом <span>${property.rent[1]}</span></li>
            <li>С 2 домами <span>${property.rent[2]}</span></li>
            <li>С 3 домами <span>${property.rent[3]}</span></li>
            <li>С 4 домами <span>${property.rent[4]}</span></li>
          </ul>

          <p className="rent-hotel">С ОТЕЛЕМ: ${property.rent[5]}</p>

          <div className="card-footer">
            <p>Стоимость дома: ${property.houseCost}</p>
            <p>Стоимость отеля: ${property.houseCost} + 4 дома</p>
            <p>Залоговая стоимость: ${property.mortgageValue}</p>
          </div>
        </div>
          </div>
          {renderBack()}
        </div>
      </div>
    );
  }

  if (property.type === 'railroad') {
    return (
      <div className={`monopoly-card ${property.mortgaged ? 'is-flipped' : ''}`}>
        <div className="card-inner">
          <div className="card-front">
        <div className="card-header-icon">🚂</div>
        <h2 className="card-title-special">{property.name}</h2>

        <div className="card-body">
          <ul className="rent-list special-list">
            <li>Аренда <span>${property.rent[0]}</span></li>
            <li>Если 2 ж/д <span>${property.rent[1]}</span></li>
            <li>Если 3 ж/д <span>${property.rent[2]}</span></li>
            <li>Если 4 ж/д <span>${property.rent[3]}</span></li>
          </ul>

          <div className="card-footer special-footer">
            <p>Залоговая стоимость: ${property.mortgageValue}</p>
          </div>
        </div>
          </div>
          {renderBack()}
        </div>
      </div>
    );
  }

  if (property.type === 'utility') {
    const icon = property.id === 'prop_12' ? '💡' : '🚰';
    return (
      <div className={`monopoly-card ${property.mortgaged ? 'is-flipped' : ''}`}>
        <div className="card-inner">
          <div className="card-front">
        <div className="card-header-icon">{icon}</div>
        <h2 className="card-title-special">{property.name}</h2>

        <div className="card-body">
          <div className="utility-desc">
            <p>Если игрок владеет <b>одним</b> предприятием, аренда равна сумме кубиков, умноженной на <b>4</b>.</p>
            <p>Если игрок владеет <b>обоими</b> предприятиями, аренда равна сумме кубиков, умноженной на <b>10</b>.</p>
          </div>

          <div className="card-footer special-footer">
            <p>Залоговая стоимость: ${property.mortgageValue}</p>
          </div>
        </div>
          </div>
          {renderBack()}
        </div>
      </div>
    );
  }

  if (property.type === 'tax') {
    return (
      <div className="monopoly-card special-cell tax">
        <div className="card-header-icon">💎</div>
        <h2 className="card-title-special">{property.name}</h2>
        <div className="card-body">
          <p className="special-desc">Заплатите налог государству!</p>
          <p className="special-value">-${property.price}</p>
        </div>
      </div>
    );
  }

  if (property.type === 'chance' || property.type === 'chest') {
    const isChance = property.type === 'chance';
    return (
      <div className={`monopoly-card special-cell ${property.type}`}>
        <div className="card-header-icon">{isChance ? '❓' : '🎁'}</div>
        <h2 className="card-title-special">{property.name}</h2>
        <div className="card-body">
          <p className="special-desc">Тяните карточку из колоды!</p>
        </div>
      </div>
    );
  }

  if (property.type?.includes('corner')) {
    let icon = '🏁';
    if (property.type.includes('jail')) icon = '🚓';
    if (property.type.includes('parking')) icon = '🅿';
    if (property.type.includes('police')) icon = '👮';
    return (
      <div className="monopoly-card special-cell corner">
        <div className="card-header-icon">{icon}</div>
        <h2 className="card-title-special">{property.name}</h2>
        <div className="card-body">
          <p className="special-desc">Особая клетка на поле.</p>
        </div>
      </div>
    );
  }

  return <div className="monopoly-card special-cell">
    <div className="card-header-icon">📍</div>
    <h2 className="card-title-special">{property.name}</h2>
  </div>;
}