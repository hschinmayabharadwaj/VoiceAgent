'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MindfulnessSessionType, ExperienceLevel } from '@/lib/types';
import { Pause, Play, Square, Volume2 } from 'lucide-react';

interface SessionPlayerProps {
  sessionType: MindfulnessSessionType;
  duration: number; // in minutes
  experience: ExperienceLevel;
  onEnd: () => void;
}

export function SessionPlayer({ sessionType, duration, experience, onEnd }: SessionPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [phase, setPhase] = useState<'preparation' | 'session' | 'completion'>('preparation');
  
  const totalSeconds = duration * 60;
  const progress = (currentTime / totalSeconds) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentTime < totalSeconds) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalSeconds) {
            setIsPlaying(false);
            setPhase('completion');
            return totalSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, totalSeconds]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSessionTitle = () => {
    const titles = {
      'breathing': 'Breathing Exercise',
      'meditation': 'Guided Meditation',
      'body-scan': 'Body Scan',
      'mindful-moment': 'Mindful Moment',
    };
    return titles[sessionType];
  };

  const getSessionInstructions = () => {
    const instructions = {
      'breathing': 'Focus on your breath. Breathe in slowly through your nose, hold, then exhale through your mouth.',
      'meditation': 'Sit comfortably and focus on the present moment. Let thoughts come and go without judgment.',
      'body-scan': 'Starting from your toes, slowly bring attention to each part of your body, noticing any sensations.',
      'mindful-moment': 'Take a pause from your day. Notice five things you can see, four you can hear, three you can touch.',
    };
    return instructions[sessionType];
  };

  const handlePlayPause = () => {
    if (phase === 'preparation') {
      setPhase('session');
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    onEnd();
  };

  const handleSessionComplete = () => {
    onEnd();
  };

  if (phase === 'completion') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">
              Session Complete! 🌟
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Wonderful! You've completed your {duration}-minute {getSessionTitle().toLowerCase()} session.
            </p>
            <div className="space-y-4">
              <p className="text-sm">
                Take a moment to notice how you feel. Regular practice can help build resilience and inner calm.
              </p>
              <Button onClick={handleSessionComplete} size="lg">
                Return to Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">{getSessionTitle()}</CardTitle>
          <p className="text-muted-foreground">
            {duration} minutes • {experience} level
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {phase === 'preparation' && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Volume2 className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Get Ready</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Find a comfortable position, close your eyes if you'd like, and prepare to begin your mindfulness journey.
                </p>
              </div>
            </div>
          )}

          {phase === 'session' && (
            <div className="text-center space-y-6">
              <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <div className="text-3xl font-mono font-bold text-primary">
                  {formatTime(totalSeconds - currentTime)}
                </div>
              </div>
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {getSessionInstructions()}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button
              onClick={handlePlayPause}
              size="lg"
              className="min-w-[120px]"
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  {phase === 'preparation' ? 'Begin' : 'Resume'}
                </>
              )}
            </Button>
            
            <Button
              onClick={handleStop}
              variant="outline"
              size="lg"
            >
              <Square className="mr-2 h-4 w-4" />
              End Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}