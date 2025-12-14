'use client';

import { useState, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Wind, Hand, Award, Repeat } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const CYCLE_DURATION = 8000; // 8 seconds total: 3s inhale, 1s hold, 4s exhale
const INHALE_DURATION = 3000;
const HOLD_DURATION = 1000;
const EXHALE_DURATION = 4000;
const TOTAL_CYCLES = 5;

type GameState = 'idle' | 'playing' | 'results';
type Phase = 'inhale' | 'hold' | 'exhale';

export function CalmPulseGame() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [score, setScore] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        setIsHolding(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsHolding(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    let cycleTimer: NodeJS.Timeout;

    if (cycle < TOTAL_CYCLES) {
      // Start of a new cycle
      setPhase('inhale');
      cycleTimer = setTimeout(() => {
        setPhase('hold');
        setTimeout(() => {
          setPhase('exhale');
          setTimeout(() => {
            setCycle((c) => c + 1);
          }, EXHALE_DURATION);
        }, HOLD_DURATION);
      }, INHALE_DURATION);
    } else {
      setGameState('results');
    }

    return () => clearTimeout(cycleTimer);
  }, [gameState, cycle]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const scoreInterval = setInterval(() => {
      // Award points if user is holding during the correct phase (inhale)
      if (isHolding && phase === 'inhale') {
        setScore((s) => s + 2);
      }
      // Penalize for holding during the wrong phase (exhale)
      if (isHolding && phase === 'exhale') {
        setScore((s) => Math.max(0, s - 1));
      }
    }, 100);

    return () => clearInterval(scoreInterval);
  }, [gameState, isHolding, phase]);
  
  const startGame = () => {
      setGameState('playing');
      setCycle(0);
      setScore(0);
  }

  const resetGame = () => {
      setGameState('idle');
      setCycle(0);
      setScore(0);
  }

  const renderContent = () => {
    switch (gameState) {
      case 'idle':
        return (
          <>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Wind className="w-6 h-6 text-primary" />
                <CardTitle className="font-headline">Calm Pulse</CardTitle>
              </div>
              <CardDescription>
                A simple breathing game to help you relax and find your rhythm.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>Follow the circle as it expands and contracts.</p>
              <p className="font-semibold">Press and hold the <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Spacebar</kbd> as you breathe in, and release as you breathe out.</p>
              <p className="text-sm text-muted-foreground">Try to match the rhythm for all 5 cycles.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={startGame} className="w-full">
                Begin
              </Button>
            </CardFooter>
          </>
        );
      case 'playing':
        const phaseText = {
            inhale: "Breathe In...",
            hold: "Hold",
            exhale: "Breathe Out...",
        }[phase];
        
        return (
          <>
          <CardContent className="flex flex-col items-center justify-center space-y-8 pt-6">
             <div className='relative w-48 h-48'>
                {/* Outer glow rings */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
                  animate={{
                    scale: phase === 'inhale' ? [1, 1.3, 1] : [1, 0.7, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: phase === 'inhale' ? INHALE_DURATION/1000 : EXHALE_DURATION/1000,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full bg-primary/20 blur-lg"
                  animate={{
                    scale: phase === 'inhale' ? [1, 1.2, 1] : [1, 0.8, 1],
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{
                    duration: phase === 'inhale' ? INHALE_DURATION/1000 : EXHALE_DURATION/1000,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.1
                  }}
                />
                
                <AnimatePresence>
                <motion.div
                  key={phase}
                  initial={{ scale: phase === 'inhale' ? 0.5 : 1, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5}}
                  className='absolute inset-0'
                >
                    <motion.div
                        className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-2 border-primary/30 shadow-lg"
                        animate={ phase === 'inhale' ? { 
                          scale: 1,
                          boxShadow: [
                            '0 0 20px rgba(174, 207, 207, 0.4)',
                            '0 0 40px rgba(174, 207, 207, 0.8)',
                            '0 0 20px rgba(174, 207, 207, 0.4)'
                          ]
                        } : { 
                          scale: 0.5,
                          boxShadow: [
                            '0 0 10px rgba(174, 207, 207, 0.3)',
                            '0 0 5px rgba(174, 207, 207, 0.2)',
                            '0 0 10px rgba(174, 207, 207, 0.3)'
                          ]
                        }}
                        transition={{ 
                          duration: phase === 'inhale' ? INHALE_DURATION/1000 : EXHALE_DURATION/1000, 
                          ease: "easeInOut"
                        }}
                    >
                      {/* Particle effects */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-primary/50 rounded-full"
                          style={{
                            top: '50%',
                            left: '50%',
                          }}
                          animate={{
                            x: Math.cos((i / 8) * Math.PI * 2) * (phase === 'inhale' ? 60 : 30),
                            y: Math.sin((i / 8) * Math.PI * 2) * (phase === 'inhale' ? 60 : 30),
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: phase === 'inhale' ? INHALE_DURATION/1000 : EXHALE_DURATION/1000,
                            ease: "easeInOut",
                            delay: (i / 8) * 0.2
                          }}
                        />
                      ))}
                    </motion.div>
                </motion.div>
                </AnimatePresence>
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                     <motion.p 
                       className='text-xl font-bold text-primary select-none'
                       animate={{
                         scale: [1, 1.05, 1],
                         opacity: [0.8, 1, 0.8]
                       }}
                       transition={{
                         duration: 1.5,
                         repeat: Infinity,
                         ease: "easeInOut"
                       }}
                     >
                       {phaseText}
                     </motion.p>
                </div>
            </div>
            <div className="w-full space-y-2">
                <motion.p 
                  className="text-center text-sm text-muted-foreground"
                  key={cycle}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Cycle {cycle + 1} of {TOTAL_CYCLES}
                </motion.p>
                <Progress value={(cycle / TOTAL_CYCLES) * 100} />
            </div>
            <motion.div 
              className="flex items-center gap-2 p-2 rounded-lg bg-muted"
              animate={{
                scale: isHolding ? 1.05 : 1,
                backgroundColor: isHolding ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--muted))'
              }}
              transition={{ duration: 0.2 }}
            >
                <motion.div
                  animate={{ 
                    rotate: isHolding ? [0, 10, -10, 0] : 0 
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Hand className="w-5 h-5 text-muted-foreground" />
                </motion.div>
                <span className="text-sm font-semibold text-muted-foreground">
                    {isHolding ? 'Holding...' : 'Released'}
                </span>
            </motion.div>
          </CardContent>
          </>
        );
        case 'results':
            const finalScore = Math.min(100, Math.round((score / (TOTAL_CYCLES * 60)) * 100)); // Rough percentage
            return(
                <>
                <CardHeader>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardTitle className="font-headline text-center">Exercise Complete</CardTitle>
                    </motion.div>
                </CardHeader>
                 <CardContent className="flex flex-col items-center justify-center space-y-4">
                    <motion.div 
                      className="flex items-center gap-3 text-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                        delay: 0.2
                      }}
                    >
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 10, 0],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{
                            duration: 1,
                            delay: 0.5
                          }}
                        >
                          <Award className="w-8 h-8" />
                        </motion.div>
                        <motion.p 
                          className="text-4xl font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {finalScore}%
                        </motion.p>
                    </motion.div>
                    <motion.p 
                      className="text-muted-foreground font-semibold"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      Sync Score
                    </motion.p>
                    <motion.p 
                      className="text-center max-w-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                        {finalScore > 75 ? "Great job! You were very in sync with your breath." : "Good effort. With practice, you'll find your rhythm."}
                    </motion.p>
                </CardContent>
                 <CardFooter>
                    <motion.div
                      className="w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button onClick={resetGame} className="w-full">
                          <Repeat className="mr-2" />
                          Play Again
                      </Button>
                    </motion.div>
                </CardFooter>
                </>
            );
    }
  };

  return <Card className="flex flex-col justify-between min-h-[350px]">{renderContent()}</Card>;
}
