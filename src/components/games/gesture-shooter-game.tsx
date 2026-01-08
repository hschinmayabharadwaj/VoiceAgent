// src/components/games/gesture-shooter-game.tsx
"use client";
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
// REMOVED: import { Hands, Results } from '@mediapipe/hands'; 
// REMOVED: import { Camera } from '@mediapipe/camera_utils';
import { Rocket } from 'lucide-react';

const GestureShooterGame: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Game State
  const gameState = useRef({
    playerX: 0.5,
    bullets: [] as { x: number; y: number }[],
    enemies: [] as { x: number; y: number }[],
    lastShotTime: 0
  });

  useEffect(() => {
    let hands: any = null;
    let camera: any = null;

    const loadMediaPipe = async () => {
      // Check if we are in the browser
      if (typeof window !== 'undefined' && webcamRef.current && webcamRef.current.video) {
        try {
          // 1. Dynamically import both libraries
          const handsModule = await import('@mediapipe/hands');
          const cameraUtils = await import('@mediapipe/camera_utils');
          
          const { Hands } = handsModule;
          const { Camera } = cameraUtils;

          // 2. Initialize Hands
          hands = new Hands({
            locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
          });

          hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });

          // Define results type as any here to avoid import issues
          hands.onResults((results: any) => {
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
              // Use Index Finger Tip (Landmark 8) for control
              const indexFinger = results.multiHandLandmarks[0][8];
              // Mirror movement (1 - x)
              gameState.current.playerX = 1 - indexFinger.x; 
            }
          });

          // 3. Initialize Camera
          camera = new Camera(webcamRef.current.video, {
            onFrame: async () => {
              if (webcamRef.current?.video && hands) {
                await hands.send({ image: webcamRef.current.video });
              }
            },
            width: 640,
            height: 480,
          });

          await camera.start();
          
        } catch (error) {
          console.error("Error loading MediaPipe:", error);
        }
      }
    };

    // Small delay to ensure webcam ref is ready
    const timer = setTimeout(() => {
        loadMediaPipe();
    }, 500);

    return () => {
      clearTimeout(timer);
      if (hands) hands.close();
      if (camera) {
          // camera.stop() might not be available on all versions, but if it is:
          // camera.stop(); 
      }
    };
  }, []);

  // --- GAME LOOP LOGIC (Unchanged) ---
  useEffect(() => {
    if (!gameStarted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastEnemySpawn = 0;

    const loop = (timestamp: number) => {
      if (gameOver) return;

      const width = canvas.width;
      const height = canvas.height;
      const state = gameState.current;

      // 1. Clear & Draw Background
      ctx.fillStyle = '#0f172a'; 
      ctx.fillRect(0, 0, width, height);

      // 2. Auto-Shoot Logic
      if (timestamp - state.lastShotTime > 250) {
        state.bullets.push({ x: state.playerX * width, y: height - 50 });
        state.lastShotTime = timestamp;
      }

      // 3. Update Positions
      state.bullets = state.bullets
        .map(b => ({ ...b, y: b.y - 8 }))
        .filter(b => b.y > 0);

      if (timestamp - lastEnemySpawn > 1200) {
        state.enemies.push({ x: Math.random() * (width - 20) + 10, y: 0 });
        lastEnemySpawn = timestamp;
      }

      state.enemies = state.enemies.map(e => ({ ...e, y: e.y + 2 }));

      // 4. Collision Detection
      state.bullets.forEach((b, bIdx) => {
        state.enemies.forEach((e, eIdx) => {
          const dist = Math.hypot(b.x - e.x, b.y - e.y);
          if (dist < 25) {
            state.bullets.splice(bIdx, 1);
            state.enemies.splice(eIdx, 1);
            setScore(s => s + 10);
          }
        });
      });

      state.enemies.forEach(e => {
        if (e.y > height) setGameOver(true);
      });

      // 5. Draw Elements
      // Player
      const px = state.playerX * width;
      const py = height - 40;
      ctx.fillStyle = '#38bdf8'; 
      ctx.beginPath();
      ctx.moveTo(px, py - 20);
      ctx.lineTo(px - 15, py + 15);
      ctx.lineTo(px + 15, py + 15);
      ctx.fill();

      // Bullets
      ctx.fillStyle = '#fbbf24'; 
      state.bullets.forEach(b => ctx.fillRect(b.x - 2, b.y, 4, 12));

      // Enemies
      ctx.fillStyle = '#f87171'; 
      state.enemies.forEach(e => {
        ctx.beginPath();
        ctx.arc(e.x, e.y, 15, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameOver, gameStarted]);

  const resetGame = () => {
    gameState.current.enemies = [];
    gameState.current.bullets = [];
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <Webcam 
        ref={webcamRef} 
        className="absolute opacity-0 pointer-events-none w-px h-px"
      />

      <div className="relative group rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-800 bg-black">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="block bg-gray-900"
        />
        
        <div className="absolute top-4 right-4 bg-gray-800/80 px-4 py-2 rounded-lg border border-gray-600">
          <span className="text-yellow-400 font-mono text-xl font-bold">SCORE: {score}</span>
        </div>

        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm">
            {gameOver ? (
              <h2 className="text-5xl font-bold text-red-500 mb-2">GAME OVER</h2>
            ) : (
              <div className="flex flex-col items-center">
                <Rocket className="w-16 h-16 text-cyan-400 mb-4 animate-bounce" />
                <h2 className="text-4xl font-bold mb-2">Motion Arcade</h2>
              </div>
            )}
            
            <p className="text-gray-300 mb-8 text-lg">
              {gameOver ? `Final Score: ${score}` : "Raise your hand to control the ship!"}
            </p>
            
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-full text-lg transition transform hover:scale-105 shadow-lg shadow-cyan-500/50"
            >
              {gameOver ? "Try Again" : "Start Mission"}
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 max-w-2xl w-full">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-cyan-600" /> How to Play
        </h3>
        <p className="text-gray-600 text-sm">
          Ensure your webcam is on. Raise your hand in front of the camera. 
          Move your <strong>index finger</strong> left or right to steer your ship. 
          The ship fires automatically!
        </p>
      </div>
    </div>
  );
};

export default GestureShooterGame;