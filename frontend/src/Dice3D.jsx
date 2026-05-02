import React, { useEffect, useState, useRef } from 'react';
import './Dice3D.css';

// Rotation needed so the face with value N faces the viewer (front)
const FACE_ROTATIONS = {
  1: 'rotateX(0deg) rotateY(0deg)',       // face-1 is already front
  2: 'rotateX(90deg) rotateY(0deg)',      // face-2 is bottom → tilt up
  3: 'rotateX(0deg) rotateY(90deg)',      // face-3 is left → turn right
  4: 'rotateX(0deg) rotateY(-90deg)',     // face-4 is right → turn left
  5: 'rotateX(-90deg) rotateY(0deg)',     // face-5 is top → tilt down
  6: 'rotateX(180deg) rotateY(0deg)',     // face-6 is back → flip
};

function DieFaces() {
  return (
    <>
      <div className="die-face die-face--1"><div className="die-dot"></div></div>
      <div className="die-face die-face--2"><div className="die-dot"></div><div className="die-dot"></div></div>
      <div className="die-face die-face--3"><div className="die-dot"></div><div className="die-dot"></div><div className="die-dot"></div></div>
      <div className="die-face die-face--4"><div className="die-dot"></div><div className="die-dot"></div><div className="die-dot"></div><div className="die-dot"></div></div>
      <div className="die-face die-face--5"><div className="die-dot"></div><div className="die-dot"></div><div className="die-dot"></div><div className="die-dot"></div><div className="die-dot"></div></div>
      <div className="die-face die-face--6"><div className="die-dot"></div><div className="die-dot"></div><div className="die-dot"></div><div className="die-dot"></div><div className="die-dot"></div><div className="die-dot"></div></div>
    </>
  );
}

export default function Dice3D({ dice1, dice2, isRolling, onRollComplete }) {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'spinning' | 'landing' | 'flat'
  const [landTransform1, setLandTransform1] = useState('');
  const [landTransform2, setLandTransform2] = useState('');
  const [scatter1, setScatter1] = useState({ x: 0, y: 0 });
  const [scatter2, setScatter2] = useState({ x: 0, y: 0 });
  // Per-die random durations (ms) — regenerated each roll
  const [slideDur1, setSlideDur1] = useState(1500);
  const [slideDur2, setSlideDur2] = useState(1500);
  const [spinDur1, setSpinDur1] = useState(0.4);
  const [spinDur2, setSpinDur2] = useState(0.4);
  const timerRef = useRef(null);

  const isRollingRef = useRef(false);

  useEffect(() => {
    if (isRolling && !isRollingRef.current) {
      isRollingRef.current = true;
      // Generate independent random values for each die
      const sd1 = 1000 + Math.floor(Math.random() * 800); // 1000–1800ms slide
      const sd2 = 1000 + Math.floor(Math.random() * 800);
      const sp1 = 0.25 + Math.random() * 0.35;            // 0.25–0.6s spin cycle
      const sp2 = 0.25 + Math.random() * 0.35;
      setSlideDur1(sd1);
      setSlideDur2(sd2);
      setSpinDur1(sp1);
      setSpinDur2(sp2);

      // Phase 1: chaotic spinning (CSS keyframe animation)
      setPhase('spinning');

      // We wrap the scatter in a tiny timeout so that if the component just mounted,
      // the browser paints it at {0,0} first, allowing the CSS transition to trigger.
      setTimeout(() => {
        // Scatter positions (die 1 goes left-ish, die 2 goes right-ish, with wide variance)
        setScatter1({
          x: Math.floor(Math.random() * 260) - 280,
          y: Math.floor(Math.random() * 400) - 200,
        });
        setScatter2({
          x: Math.floor(Math.random() * 260) + 50,
          y: Math.floor(Math.random() * 400) - 200,
        });
      }, 50);

      // After 1s of spinning, switch to "landing" — CSS transition to final rotation
      timerRef.current = setTimeout(() => {
        setPhase('landing');
        setLandTransform1(FACE_ROTATIONS[dice1] || FACE_ROTATIONS[1]);
        setLandTransform2(FACE_ROTATIONS[dice2] || FACE_ROTATIONS[1]);

        // After the 1.6s CSS transition completes, go flat
        setTimeout(() => {
          setPhase('flat');
          isRollingRef.current = false;
          if (onRollComplete) onRollComplete();
        }, 600);
      }, 900);

    } else if (!isRolling) {
      isRollingRef.current = false;
      if (phase === 'idle' && dice1) {
        setLandTransform1(FACE_ROTATIONS[dice1] || FACE_ROTATIONS[1]);
        setLandTransform2(FACE_ROTATIONS[dice2] || FACE_ROTATIONS[1]);
        setPhase('flat');
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRolling, dice1, dice2]);

  const isSpinning = phase === 'spinning';
  const isFlat = phase === 'flat';

  return (
    <div className="dice-scene">
      {/* Die 1 */}
      <div
        className={`die-wrapper ${isFlat ? 'is-flat' : ''}`}
        style={{
          transform: `translate(${scatter1.x}px, ${scatter1.y}px)`,
          transition: `transform ${slideDur1}ms cubic-bezier(0.15, 0.7, 0.3, 1)`,
        }}
      >
        <div
          className={`die-cube ${isSpinning ? 'is-rolling' : ''}`}
          style={{
            ...(isSpinning ? { animationDuration: `${spinDur1}s` } : { transform: landTransform1 }),
          }}
        >
          <DieFaces />
        </div>
      </div>

      {/* Die 2 */}
      <div
        className={`die-wrapper ${isFlat ? 'is-flat' : ''}`}
        style={{
          transform: `translate(${scatter2.x}px, ${scatter2.y}px)`,
          transition: `transform ${slideDur2}ms cubic-bezier(0.15, 0.7, 0.3, 1)`,
        }}
      >
        <div
          className={`die-cube ${isSpinning ? 'is-rolling' : ''}`}
          style={{
            ...(isSpinning ? { animationDuration: `${spinDur2}s` } : { transform: landTransform2 }),
          }}
        >
          <DieFaces />
        </div>
      </div>
    </div>
  );
}
