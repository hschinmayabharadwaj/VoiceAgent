'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { getChatResponse } from '@/lib/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUser } from '@/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { slideUpVariants, typingDotVariants } from '@/lib/animations';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || isPending) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    startTransition(async () => {
      const chatHistory = [...messages, userMessage];
      const result = await getChatResponse({
        history: chatHistory,
        currentInput: input,
      });
      setMessages(prev => [...prev, { role: 'model', content: result.response }]);
    });
  };

  const getUserInitial = () => {
    if (!user) return 'U';
    if (user.isAnonymous) return 'A';
    if (user.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="flex flex-col h-full w-full max-w-3xl mx-auto rounded-none border-0 md:rounded-lg md:border">
        <CardHeader className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CardTitle className="text-3xl font-bold font-headline">Chat with ManasMitra</CardTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardDescription className="text-lg text-muted-foreground">
              Your personal AI wellness companion.
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0 md:p-6 md:pt-0">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="space-y-6 p-4 md:p-0">
              {messages.length === 0 && (
                  <motion.div 
                    className="flex flex-col h-full items-center justify-center text-center text-muted-foreground pt-16"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      >
                        <Bot className="w-16 h-16 mb-4"/>
                      </motion.div>
                      <p className="font-semibold">Your conversation starts here.</p>
                      <p>What's on your mind today?</p>
                  </motion.div>
              )}
              <AnimatePresence mode="popLayout">
                {messages.map((msg, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className={cn('flex items-start gap-3', msg.role === 'user' ? 'justify-end' : '')}
                  >
                    {msg.role === 'model' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: 'spring',
                          stiffness: 200,
                          damping: 15,
                          delay: 0.1
                        }}
                      >
                        <Avatar className="flex-shrink-0 w-8 h-8">
                          <AvatarFallback><Bot size={20}/></AvatarFallback>
                        </Avatar>
                      </motion.div>
                    )}
                    <motion.div 
                      className={cn('rounded-lg px-4 py-2 max-w-sm break-words', msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {msg.content}
                    </motion.div>
                     {msg.role === 'user' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: 'spring',
                          stiffness: 200,
                          damping: 15,
                          delay: 0.1
                        }}
                      >
                        <Avatar className="flex-shrink-0 w-8 h-8">
                          <AvatarImage src={user?.photoURL || undefined} />
                          <AvatarFallback>{getUserInitial()}</AvatarFallback>
                        </Avatar>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
               {isPending && (
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                      <Avatar className="flex-shrink-0 w-8 h-8">
                          <AvatarFallback><Bot size={20}/></AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-4 py-2 bg-muted flex items-center gap-1">
                         <motion.div
                           variants={typingDotVariants}
                           initial="initial"
                           animate="animate"
                           className="w-2 h-2 bg-foreground/50 rounded-full"
                         />
                         <motion.div
                           variants={typingDotVariants}
                           initial="initial"
                           animate="animate"
                           transition={{ delay: 0.2 }}
                           className="w-2 h-2 bg-foreground/50 rounded-full"
                         />
                         <motion.div
                           variants={typingDotVariants}
                           initial="initial"
                           animate="animate"
                           transition={{ delay: 0.4 }}
                           className="w-2 h-2 bg-foreground/50 rounded-full"
                         />
                      </div>
                  </motion.div>
               )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input
                id="message"
                placeholder="Type your message..."
                className="flex-1"
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isPending}
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button type="submit" size="icon" disabled={isPending || !input}>
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span className="sr-only">Send</span>
                </Button>
              </motion.div>
          </form>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
