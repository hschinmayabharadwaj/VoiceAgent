'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { getCheckInResponse } from '@/lib/actions';
import { useCheckIns } from '@/lib/hooks/use-check-ins';
import { ArrowLeft, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { type Mood, type Feeling } from '@/lib/types';
import Link from 'next/link';

const moods: Mood[] = [
  { name: 'Happy', emoji: '😄' },
  { name: 'Okay', emoji: '🙂' },
  { name: 'Sad', emoji: '😢' },
  { name: 'Anxious', emoji: '😟' },
  { name: 'Angry', emoji: '😠' },
];

const feelings: Feeling[] = [
  'Grateful',
  'Stressed',
  'Lonely',
  'Optimistic',
  'Tired',
  'Motivated',
  'Overwhelmed',
  'Peaceful',
];

type AIResponseType = {
    response: string;
    recommendation: string;
} | null;

export function CheckInFlow() {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedFeelings, setSelectedFeelings] = useState<Feeling[]>([]);
  const [details, setDetails] = useState('');
  const [aiResponse, setAiResponse] = useState<AIResponseType>(null);
  const [isPending, startTransition] = useTransition();
  const { addCheckIn } = useCheckIns();

  const handleFeelingToggle = (feeling: Feeling) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling)
        ? prev.filter((f) => f !== feeling)
        : [...prev, feeling]
    );
  };

  const handleSubmit = () => {
    if (!selectedMood) return;

    startTransition(async () => {
      const checkInDataString = `Mood: ${selectedMood.name}. Feelings: ${selectedFeelings.join(', ')}. Details: ${details}`;
      const response = await getCheckInResponse({
        mood: selectedMood.name,
        feelings: selectedFeelings.join(', '),
        details: details,
        checkInData: checkInDataString,
      });
      setAiResponse(response);

      addCheckIn({
        mood: selectedMood.name,
        feelings: selectedFeelings,
        details: details,
      });
      setStep(4);
    });
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedMood(null);
    setSelectedFeelings([]);
    setDetails('');
    setAiResponse(null);
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CardTitle className="text-center font-headline">How are you feeling right now?</CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {moods.map((mood, index) => (
                <motion.button
                  key={mood.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, -5, 0],
                    transition: { duration: 0.5 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedMood(mood);
                    setStep(2);
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-transparent hover:border-primary hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <span className="text-5xl">{mood.emoji}</span>
                  <span className="font-medium">{mood.name}</span>
                </motion.button>
              ))}
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CardTitle className="font-headline">What's contributing to this feeling?</CardTitle>
                <CardDescription>Select all that apply.</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {feelings.map((feeling, index) => (
                <motion.div
                  key={feeling}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.05
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={selectedFeelings.includes(feeling) ? 'default' : 'outline'}
                    onClick={() => handleFeelingToggle(feeling)}
                    className="rounded-full"
                  >
                    {feeling}
                  </Button>
                </motion.div>
              ))}
            </CardContent>
            <CardFooter className="justify-between">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="mr-2"/> Back</Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => setStep(3)}>Continue</Button>
              </motion.div>
            </CardFooter>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CardTitle className="font-headline">Want to share more? (Optional)</CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Textarea
                  placeholder="You can write about your day, what's on your mind, or anything else..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={5}
                />
              </motion.div>
            </CardContent>
            <CardFooter className="justify-between">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" onClick={() => setStep(2)}><ArrowLeft className="mr-2"/> Back</Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleSubmit} disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get My Response
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        );
      case 4:
        return (
          <Card className="text-center">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CardTitle className="font-headline">Thank You for Sharing</CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              {aiResponse ? (
                  <>
                    <motion.div 
                      className="p-4 bg-accent/20 rounded-lg border border-accent/30"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <motion.div
                              animate={{ 
                                rotate: [0, 10, -10, 10, 0],
                                scale: [1, 1.2, 1]
                              }}
                              transition={{ duration: 1, delay: 0.3 }}
                            >
                              <Sparkles className="w-5 h-5 text-accent-foreground"/>
                            </motion.div>
                            <h4 className="font-bold text-accent-foreground">A thoughtful response for you</h4>
                        </div>
                        <p>{aiResponse.response}</p>
                    </motion.div>
                    <motion.div 
                      className="p-4 bg-secondary rounded-lg border border-secondary/50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <motion.div
                              animate={{ 
                                y: [0, -5, 0]
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                ease: 'easeInOut'
                              }}
                            >
                              <BookOpen className="w-5 h-5 text-secondary-foreground"/>
                            </motion.div>
                            <h4 className="font-bold text-secondary-foreground">A resource you might find helpful</h4>
                        </div>
                        <p>{aiResponse.recommendation}</p>
                    </motion.div>
                  </>
              ) : (
                <motion.div 
                  className="flex justify-center items-center h-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={resetFlow}>Start Another Check-in</Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="link" asChild><Link href="/progress">View My Progress</Link></Button>
              </motion.div>
            </CardFooter>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
      <AnimatePresence mode="wait">
        <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
  );
}
