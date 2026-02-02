'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, Heart, Sparkles } from 'lucide-react';
import { MindfulnessSessionType, ExperienceLevel } from '@/lib/types';
import { SessionPlayer } from '@/components/mindfulness/session-player'; // Verify the file exists at 'src/components/mindfulness/session-player.tsx' or adjust the path accordingly
import { SessionSelector } from '@/components/mindfulness/session-selector';
import { useLanguage } from '@/contexts/language-context';

export default function MindfulnessPage() {
  const { t } = useLanguage();
  const [selectedSession, setSelectedSession] = useState<{
    type: MindfulnessSessionType;
    duration: number;
    experience: ExperienceLevel;
  } | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const sessionTypes = [
    {
      type: 'breathing' as MindfulnessSessionType,
      title: 'Breathing Exercise',
      description: 'Calm your mind with guided breathing patterns',
      icon: Heart,
      color: 'bg-blue-100 text-blue-700',
      benefits: ['Reduces anxiety', 'Improves focus', 'Calms nervous system'],
    },
    {
      type: 'meditation' as MindfulnessSessionType,
      title: 'Guided Meditation',
      description: 'Find inner peace with gentle meditation guidance',
      icon: Brain,
      color: 'bg-purple-100 text-purple-700',
      benefits: ['Enhances awareness', 'Reduces stress', 'Improves emotional balance'],
    },
    {
      type: 'body-scan' as MindfulnessSessionType,
      title: 'Body Scan',
      description: 'Release tension by connecting with your body',
      icon: Sparkles,
      color: 'bg-green-100 text-green-700',
      benefits: ['Releases tension', 'Improves body awareness', 'Promotes relaxation'],
    },
    {
      type: 'mindful-moment' as MindfulnessSessionType,
      title: 'Mindful Moment',
      description: 'Quick mindfulness practice for busy times',
      icon: Clock,
      color: 'bg-orange-100 text-orange-700',
      benefits: ['Quick stress relief', 'Present moment awareness', 'Easy to integrate'],
    },
  ];

  const handleStartSession = (type: MindfulnessSessionType, duration: number, experience: ExperienceLevel) => {
    setSelectedSession({ type, duration, experience });
    setIsSessionActive(true);
  };

  const handleSessionEnd = () => {
    setIsSessionActive(false);
    setSelectedSession(null);
  };

  if (isSessionActive && selectedSession) {
    return (
      <SessionPlayer
        sessionType={selectedSession.type}
        duration={selectedSession.duration}
        experience={selectedSession.experience}
        onEnd={handleSessionEnd}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader breadcrumbs={[{ href: '/', label: t('nav.dashboard') }, { label: t('nav.mindfulness') }]} />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 font-headline text-primary">
            {t('mindfulness.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('mindfulness.subtitle')}
          </p>
        </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {sessionTypes.map((session) => {
          const IconComponent = session.icon;
          return (
            <Card key={session.type} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${session.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <CardTitle className="font-headline">{session.title}</CardTitle>
                </div>
                <CardDescription>{session.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Benefits:</p>
                    <div className="flex flex-wrap gap-1">
                      {session.benefits.map((benefit) => (
                        <Badge key={benefit} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <SessionSelector
                    sessionType={session.type}
                    onStartSession={handleStartSession}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-accent/50">
        <CardHeader>
          <CardTitle className="text-center font-headline">Getting Started with Mindfulness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 text-center">
            <div>
              <h3 className="font-semibold mb-2">Choose Your Time</h3>
              <p className="text-sm text-muted-foreground">
                Even 3 minutes can make a difference. Start small and build your practice.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Find a Quiet Space</h3>
              <p className="text-sm text-muted-foreground">
                Sit comfortably where you won't be disturbed. Use headphones if needed.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Be Kind to Yourself</h3>
              <p className="text-sm text-muted-foreground">
                It's normal for your mind to wander. Gently bring your attention back.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}