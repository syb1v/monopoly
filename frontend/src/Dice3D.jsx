import React, { useEffect, useState } from 'react';
import './Dice3D.css';

export default function Dice3D({ dice1, dice2, isRolling }) {
  const [transform1, setTransform1] = useState('');
  const [transform2, setTransform2] = useState('');

  // Mapping from dice value to rotation needed to show that face
  const getTargetRotation = (val) => {
    switch(val) {
      case 1: return { x: 0, y: 0 };
      case 2: return { x: 90, y: 0 };
      case 3: return { x: 0, y: 90 };
      case 4: return { x: 0, y: -90 };
      case 5: return { x: -90, y: 0 };
      case 6: return { x: 180, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };

  useEffect(() => {
    if (isRolling) {
      // Create a wild spin
      const randomSpinX1 = Math.floor(Math.random() * 4 + 2) * 360; // 2-5 spins
      const randomSpinY1 = Math.floor(Math.random() * 4 + 2) * 360;
      const randomSpinX2 = Math.floor(Math.random() * 4 + 2) * 360;
      const randomSpinY2 = Math.floor(Math.random() * 4 + 2) * 360;

      const target1 = getTargetRotation(dice1);
      const target2 = getTargetRotation(dice2);

      // We add the random full 360 spins to the target rotation
      setTransform1(`rotateX(${target1.x + randomSpinX1}deg) rotateY(${target1.y + randomSpinY1}deg) rotateZ(${Math.random()*90}deg)`);
      setTransform2(`rotateX(${target2.x + randomSpinX2}deg) rotateY(${target2.y + randomSpinY2}deg) rotateZ(${Math.random()*90}deg)`);
    } else {
      // Just settle on the current target without the Z axis chaos if not rolling
      // but keep the current orientation by stripping the huge spins or just leaving it
      // Actually it's best to leave the transform as is so it doesn't snap back.
    }
  }, [dice1, dice2, isRolling]);

  return (
    <div className="dice-container-3d">
      <div className={`die-3d ${isRolling ? 'rolling' : ''}`} style={{ transform: transform1 }}>
        <div className="face front"><div className="dot"></div></div>
        <div className="face bottom"><div className="dot"></div><div className="dot"></div></div>
        <div className="face left"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
        <div className="face right"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
        <div className="face top"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
        <div className="face back"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
      </div>
      <div className={`die-3d ${isRolling ? 'rolling' : ''}`} style={{ transform: transform2 }}>
        <div className="face front"><div className="dot"></div></div>
        <div className="face bottom"><div className="dot"></div><div className="dot"></div></div>
        <div className="face left"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
        <div className="face right"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
        <div className="face top"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
        <div className="face back"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
      </div>
    </div>
  );
}
