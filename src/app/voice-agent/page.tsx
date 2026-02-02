'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Loader2, Volume2, User, Bot, Send } from 'lucide-react';
import { voiceAgent, textToSpeech } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function VoiceAgentPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [useVoice, setUseVoice] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map());

  const { toast } = useToast();

  // Initialize audio player
  useEffect(() => {
    audioPlayerRef.current = new Audio();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.preload = 'auto';
      audioPlayerRef.current.volume = 1.0;
    }

    // Check if speech recognition is available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setUseVoice(true);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Get AI response
      const response = await voiceAgent({
        history: newMessages,
        currentInput: text,
      });

      const aiMessage: Message = { role: 'model', content: response.response };
      setMessages(prev => [...prev, aiMessage]);

      // Generate audio separately
      setIsGeneratingAudio(true);
      const audioResult = await textToSpeech({ text: response.response });
      setIsGeneratingAudio(false);

      // Cache and play audio only if available
      if (audioResult.audioDataUri) {
        audioCacheRef.current.set(response.response, audioResult.audioDataUri);

        if (audioPlayerRef.current) {
          audioPlayerRef.current.src = audioResult.audioDataUri;
          audioPlayerRef.current.play().catch(e => {
            console.warn('Audio playback failed:', e);
          });
        }
      }
    } catch (error) {
      console.error('Error with voice agent:', error);
      toast({
        variant: 'destructive',
        title: 'AI Agent Error',
        description: "I'm having trouble responding right now. Please try again.",
      });
      // Remove the user message if AI failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const toggleRecording = () => {
    if (!useVoice) {
      toast({
        variant: 'destructive',
        title: 'Voice Not Available',
        description: 'Voice input is not supported in your browser.',
      });
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('Error stopping recognition:', e);
        }
      }
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error, event);
        setIsRecording(false);

        if (event.error === 'not-allowed') {
          toast({
            variant: 'destructive',
            title: 'Microphone Access Denied',
            description: 'Please allow microphone access to use voice input.',
          });
          setUseVoice(false);
        } else if (event.error === 'network') {
          toast({
            variant: 'destructive',
            title: 'Speech Recognition Unavailable',
            description: 'Speech recognition service is temporarily unavailable. Please use text input instead.',
          });
          setUseVoice(false);
        } else if (event.error === 'no-speech') {
          // Don't show error for no-speech, just silently stop recording
          return;
        } else if (event.error === 'aborted') {
          // Don't show error for aborted recordings
          return;
        } else {
          toast({
            variant: 'destructive',
            title: 'Voice Input Error',
            description: `Voice recognition failed (${event.error}). Text input is available.`,
          });
          setUseVoice(false);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      // Request microphone permission and start
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          recognitionRef.current = recognition;
          recognition.start();
          setIsRecording(true);
        })
        .catch(() => {
          toast({
            variant: 'destructive',
            title: 'Microphone Access Denied',
            description: 'Please allow microphone access to use voice input.',
          });
          setUseVoice(false);
        });

    } catch (error) {
      console.warn('Speech recognition setup failed:', error);
      setUseVoice(false);
      toast({
        variant: 'destructive',
        title: 'Voice Input Unavailable',
        description: 'Voice recognition is not available. This might be due to browser compatibility or network issues. Text input works normally.',
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader breadcrumbs={[{ href: '/', label: t('nav.dashboard') }, { label: t('nav.voiceAgent') }]} />
      <div className="flex-1 p-4 md:p-8 flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold font-headline">{t('voice.title')}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {t('voice.subtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4 h-96 overflow-y-auto p-4 rounded-lg border bg-muted/50">
              {messages.length === 0 && (
                <div className="flex flex-col h-full items-center justify-center text-center text-muted-foreground">
                  <Volume2 className="w-16 h-16 mb-4"/>
                  <p className="font-semibold">Your conversation will appear here.</p>
                  <p>Start by typing a message or using voice input.</p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'model' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Bot size={20}/>
                    </div>
                  )}
                  <div className={`rounded-lg px-4 py-2 max-w-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                      <User size={20}/>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Bot size={20}/>
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-background flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin"/>
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}

              {isGeneratingAudio && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Volume2 size={16}/>
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-background flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin"/>
                    <span className="text-sm text-muted-foreground">Generating voice...</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {useVoice && (
              <div className="flex justify-center">
                <Button
                  onClick={toggleRecording}
                  size="lg"
                  className="rounded-full w-16 h-16"
                  disabled={isLoading || isGeneratingAudio}
                  variant={isRecording ? "destructive" : "default"}
                >
                  {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                </Button>
              </div>
            )}

            <form onSubmit={handleTextSubmit} className="w-full flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1"
                disabled={isLoading || isGeneratingAudio}
              />
              <Button
                type="submit"
                size="lg"
                disabled={!inputText.trim() || isLoading || isGeneratingAudio}
              >
                <Send size={20} />
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              {isRecording ? "Listening..." :
               isLoading ? "Thinking..." :
               isGeneratingAudio ? "Generating voice..." :
               "Type a message or use voice input"}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
