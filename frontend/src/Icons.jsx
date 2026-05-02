import React from 'react';

// Railroad / Train
export const IconTrain = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path fill="#455A64" d="M10 50h44v4H10z"/>
    <path fill="#263238" d="M22 24h24v18H22z"/>
    <path fill="#D32F2F" d="M14 42h40v8H14z"/>
    <circle cx="24" cy="46" r="6" fill="#FBC02D"/>
    <circle cx="44" cy="46" r="6" fill="#FBC02D"/>
    <circle cx="24" cy="46" r="4" fill="#37474F"/>
    <circle cx="44" cy="46" r="4" fill="#37474F"/>
    <path fill="#D32F2F" d="M38 12h8v12h-8z"/>
    <path fill="#263238" d="M36 10h12v4H36z"/>
    <path fill="#90A4AE" d="M46 6a4 4 0 1 0 8 0 4 4 0 1 0-8 0zm6-4a3 3 0 1 0 6 0 3 3 0 1 0-6 0z"/>
    <path fill="#CFD8DC" d="M26 28h4v8h-4zm10 0h4v8h-4z"/>
    <path fill="#FBC02D" d="M8 44l6-6v10l-6-4z"/>
  </svg>
);

// Electric / Lightbulb
export const IconLightbulb = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="28" r="20" fill="#FFEB3B"/>
    <path fill="#FBC02D" d="M32 8c-11.05 0-20 8.95-20 20 0 6.64 3.24 12.52 8.21 16.27L22 52h20l1.79-7.73C48.76 40.52 52 34.64 52 28c0-11.05-8.95-20-20-20z"/>
    <path fill="#9E9E9E" d="M26 50h12v4H26zm-2 6h16v4H24z"/>
    <path fill="#616161" d="M30 60h4v4h-4z"/>
    <path fill="#FFF59D" d="M36 28h-8v-8h8v8z"/>
    <path fill="#FFF" d="M20 20a12 12 0 0 1 8-8v4a8 8 0 0 0-5.66 5.66L20 20z"/>
  </svg>
);

// Water / Faucet
export const IconWater = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path fill="#90A4AE" d="M46 22H18v-8h28v8z"/>
    <path fill="#CFD8DC" d="M14 14h36v8H14z"/>
    <path fill="#607D8B" d="M40 22h12v20h-8V30H20v12h-8V22h28z"/>
    <circle cx="16" cy="18" r="6" fill="#F44336"/>
    <circle cx="48" cy="18" r="6" fill="#2196F3"/>
    <path fill="#03A9F4" d="M32 40c-6 0-10 4.48-10 10 0 5.52 10 14 10 14s10-8.48 10-14c0-5.52-4-10-10-10z"/>
    <path fill="#B3E5FC" d="M28 48c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.1-.45 2.1-1.17 2.83A3.98 3.98 0 0 1 32 52c-2.21 0-4-1.79-4-4z"/>
  </svg>
);

// Chance / Question Mark
export const IconChance = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path fill="#FF9800" d="M32 2L4 32l28 30 28-30L32 2z"/>
    <path fill="#FFC107" d="M32 6L8 32l24 26 24-26L32 6z"/>
    <path fill="#FFF" d="M28 20c0-4 10-4 10 0 0 4-4 6-4 10h-4c0-6 8-6 8-10 0-2-4-2-4 0h-6zm2 16h6v6h-6v-6z"/>
  </svg>
);

// Chest / Gift
export const IconChest = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path fill="#1976D2" d="M8 28h48v30H8z"/>
    <path fill="#2196F3" d="M4 22h56v10H4z"/>
    <path fill="#0D47A1" d="M8 22s0-10 24-10 24 10 24 10H8z"/>
    <path fill="#FFC107" d="M28 12h8v46h-8z"/>
    <path fill="#FFA000" d="M30 30h4v6h-4z"/>
    <circle cx="32" cy="38" r="4" fill="#FFC107"/>
    <path fill="#64B5F6" d="M12 32h12v4H12zm28 0h12v4H40z"/>
  </svg>
);

// Tax / Diamond
export const IconTax = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path fill="#E53935" d="M32 62L4 24l12-16h32l12 16L32 62z"/>
    <path fill="#FFCDD2" d="M16 8l-12 16 28 38L16 8z"/>
    <path fill="#EF5350" d="M32 62L48 8H16l16 54z"/>
    <path fill="#FFF" d="M24 16h16v4H24zm6 6h4v8h-4zm0 10h4v4h-4z"/>
  </svg>
);

// Go / Arrow
export const IconFlag = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path fill="#4CAF50" d="M4 24h32v-8l24 16-24 16v-8H4V24z"/>
    <path fill="#388E3C" d="M36 16v8H4v16h32v8l24-16-24-16zm4 8v16l12-8-12-8z"/>
    <text x="12" y="36" fill="#FFF" fontFamily="Arial" fontWeight="bold" fontSize="16">GO</text>
  </svg>
);

// Jail / Bars
export const IconJail = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path fill="#F44336" d="M8 8h48v48H8z"/>
    <path fill="#FF9800" d="M20 24s0-8 12-8 12 8 12 8v12H20V24z"/>
    <circle cx="28" cy="22" r="2" fill="#000"/>
    <circle cx="36" cy="22" r="2" fill="#000"/>
    <path fill="#000" d="M28 28h8v2h-8z"/>
    <path fill="#607D8B" d="M14 8h4v48h-4zm12 0h4v48h-4zm12 0h4v48h-4zm12 0h4v48h-4z"/>
    <path fill="#455A64" d="M8 14h48v4H8zm0 20h48v4H8zm0 20h48v4H8z"/>
  </svg>
);

// Parking / Car
export const IconParking = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path fill="#2196F3" d="M4 4h56v56H4z"/>
    <path fill="#FFF" d="M24 12h12c6 0 10 4 10 10s-4 10-10 10H32v16h-8V12zm8 12h4c2 0 3-1 3-3s-1-3-3-3h-4v6z"/>
    <path fill="#E53935" d="M16 48l4-8h24l4 8H16z"/>
    <path fill="#D32F2F" d="M12 48h40v8H12z"/>
    <circle cx="20" cy="52" r="3" fill="#FFF"/>
    <circle cx="44" cy="52" r="3" fill="#FFF"/>
  </svg>
);

// Police / Siren
export const IconPolice = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path fill="#1565C0" d="M12 32h40v16H12z"/>
    <path fill="#1E88E5" d="M20 16l-8 16h40l-8-16H20z"/>
    <path fill="#42A5F5" d="M24 20h16v8H24z"/>
    <circle cx="20" cy="48" r="8" fill="#424242"/>
    <circle cx="44" cy="48" r="8" fill="#424242"/>
    <circle cx="20" cy="48" r="4" fill="#E0E0E0"/>
    <circle cx="44" cy="48" r="4" fill="#E0E0E0"/>
    <path fill="#F44336" d="M28 8h8v8h-8z"/>
    <path fill="#FFCDD2" d="M30 10h4v4h-4z"/>
  </svg>
);

// House
export const IconHouse = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path fill="#4CAF50" d="M8 32l24-24 24 24v24H8V32z"/>
    <path fill="#388E3C" d="M32 8L8 32h48L32 8z"/>
    <path fill="#1B5E20" d="M26 36h12v20H26z"/>
    <path fill="#E8F5E9" d="M16 36h8v8h-8zm24 0h8v8h-8z"/>
  </svg>
);

// Hotel / Building
export const IconHotel = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path fill="#F44336" d="M12 12h40v44H12z"/>
    <path fill="#D32F2F" d="M12 12l20-8 20 8v44H12z"/>
    <path fill="#FFCDD2" d="M20 20h6v6h-6zm10 0h6v6h-6zm10 0h6v6h-6zm-20 10h6v6h-6zm10 0h6v6h-6zm10 0h6v6h-6zm-20 10h6v6h-6zm10 0h6v6h-6zm10 0h6v6h-6z"/>
    <path fill="#B71C1C" d="M26 50h12v6H26z"/>
  </svg>
);

// Nav: Board (Map)
export const IconMap = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="21"/>
    <line x1="15" y1="3" x2="15" y2="21"/>
  </svg>
);

// Nav: Action (Gamepad)
export const IconGamepad = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="6" y1="12" x2="10" y2="12"/>
    <line x1="8" y1="10" x2="8" y2="14"/>
    <line x1="15" y1="13" x2="15.01" y2="13"/>
    <line x1="18" y1="11" x2="18.01" y2="11"/>
    <rect x="2" y="6" width="20" height="12" rx="2"/>
  </svg>
);

// Nav: Properties (Layers or Homes)
export const IconProperties = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 12 12 17 22 12"/>
    <polyline points="2 17 12 22 22 17"/>
  </svg>
);

// Nav: Log (Clipboard)
export const IconLog = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <line x1="8" y1="10" x2="16" y2="10"/>
    <line x1="8" y1="14" x2="16" y2="14"/>
    <line x1="8" y1="18" x2="12" y2="18"/>
  </svg>
);

// Header: Rules (Book)
export const IconBook = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

// Header: End Game (Stop/X)
export const IconStop = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

// Location Pin
export const IconPin = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

// Settings
export const IconSettings = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// Dice
export const IconDice = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5" fill={color}/>
    <circle cx="15.5" cy="15.5" r="1.5" fill={color}/>
    <circle cx="15.5" cy="8.5" r="1.5" fill={color}/>
    <circle cx="8.5" cy="15.5" r="1.5" fill={color}/>
    <circle cx="12" cy="12" r="1.5" fill={color}/>
  </svg>
);
