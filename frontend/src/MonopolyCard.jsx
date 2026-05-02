import React from 'react';
import './MonopolyCard.css';
import { 
  IconTrain, IconLightbulb, IconWater, IconChance, IconChest, 
  IconTax, IconFlag, IconJail, IconParking, IconPolice, IconPin 
} from './Icons';

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
        <div className="card-header-icon"><IconTrain size={48} color="#333"/></div>
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
    const IconComponent = property.id === 'prop_12' ? IconLightbulb : IconWater;
    return (
      <div className={`monopoly-card ${property.mortgaged ? 'is-flipped' : ''}`}>
        <div className="card-inner">
          <div className="card-front">
        <div className="card-header-icon"><IconComponent size={48} color="#333"/></div>
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
        <div className="card-header-icon"><IconTax size={48} color="#e53935"/></div>
        <h2 className="card-title-special">{property.name}</h2>
        <div className="card-body">
          <p className="special-desc">
            {property.id === 'prop_4' ? 'Подоходный налог. Оплатите фиксированную сумму в банк.' : 'Сверхналог на роскошь. Оплатите в банк.'}
          </p>
          <p className="special-value">-${property.price}</p>
        </div>
      </div>
    );
  }

  if (property.type === 'chance' || property.type === 'chest') {
    const isChance = property.type === 'chance';
    const IconComponent = isChance ? IconChance : IconChest;
    const color = isChance ? "#f57c00" : "#1976d2";
    return (
      <div className={`monopoly-card special-cell ${property.type}`}>
        <div className="card-header-icon"><IconComponent size={48} color={color}/></div>
        <h2 className="card-title-special">{property.name}</h2>
        <div className="card-body">
          <p className="special-desc">
            {isChance 
              ? 'Возьмите верхнюю карточку из колоды "ШАНС" и следуйте указаниям.' 
              : 'Возьмите верхнюю карточку из колоды "ОБЩЕСТВЕННАЯ КАЗНА" и следуйте указаниям.'}
          </p>
        </div>
      </div>
    );
  }

  if (property.type?.includes('corner')) {
    let IconComponent = IconFlag;
    let color = "#4caf50";
    let desc = 'Проходя через эту клетку, вы получаете зарплату $200.';
    if (property.type.includes('jail')) {
      IconComponent = IconJail;
      color = "#333";
      desc = 'Вы просто посещаете тюрьму. Если вы попали сюда по указанию, оставайтесь здесь до выхода.';
    }
    if (property.type.includes('parking')) {
      IconComponent = IconParking;
      color = "#1976d2";
      desc = 'Бесплатная стоянка. Отдыхайте до следующего хода. Никаких штрафов или выплат.';
    }
    if (property.type.includes('police')) {
      IconComponent = IconPolice;
      color = "#e53935";
      desc = 'ОТПРАВЛЯЙТЕСЬ В ТЮРЬМУ! Переместите свою фишку на клетку Тюрьма. Не проходите через СТАРТ, не получайте $200.';
    }
    return (
      <div className="monopoly-card special-cell corner">
        <div className="card-header-icon"><IconComponent size={48} color={color}/></div>
        <h2 className="card-title-special">{property.name}</h2>
        <div className="card-body">
          <p className="special-desc">{desc}</p>
        </div>
      </div>
    );
  }

  return <div className="monopoly-card special-cell">
    <div className="card-header-icon"><IconPin size={48} color="#333"/></div>
    <h2 className="card-title-special">{property.name}</h2>
  </div>;
}