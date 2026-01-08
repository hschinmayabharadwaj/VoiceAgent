// src/app/motion-arcade/page.tsx
import React from 'react';
import GestureShooterGame from '../../components/games/gesture-shooter-game';

export default function MotionArcadePage() {
  return (
    <div className="flex flex-col h-full bg-sidebar p-8 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Motion Arcade</h1>
        <p className="text-gray-500">Engage your body and mind with gesture-controlled gaming.</p>
      </div>
      <GestureShooterGame />
    </div>
  );
}