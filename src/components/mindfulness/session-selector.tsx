'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MindfulnessSessionType, ExperienceLevel } from '@/lib/types';
import { Play } from 'lucide-react';

interface SessionSelectorProps {
  sessionType: MindfulnessSessionType;
  onStartSession: (type: MindfulnessSessionType, duration: number, experience: ExperienceLevel) => void;
}

export function SessionSelector({ sessionType, onStartSession }: SessionSelectorProps) {
  const [duration, setDuration] = useState<number>(5);
  const [experience, setExperience] = useState<ExperienceLevel>('beginner');

  const durationOptions = [
    { value: 3, label: '3 minutes' },
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 20, label: '20 minutes' },
  ];

  const experienceOptions = [
    { value: 'beginner' as ExperienceLevel, label: 'Beginner' },
    { value: 'intermediate' as ExperienceLevel, label: 'Intermediate' },
    { value: 'advanced' as ExperienceLevel, label: 'Advanced' },
  ];

  const handleStartSession = () => {
    onStartSession(sessionType, duration, experience);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`duration-${sessionType}`}>Duration</Label>
          <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
            <SelectTrigger id={`duration-${sessionType}`}>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`experience-${sessionType}`}>Experience Level</Label>
          <Select value={experience} onValueChange={(value) => setExperience(value as ExperienceLevel)}>
            <SelectTrigger id={`experience-${sessionType}`}>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {experienceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleStartSession} className="w-full" size="lg">
        <Play className="mr-2 h-4 w-4" />
        Start Session ({duration} min)
      </Button>
    </div>
  );
}