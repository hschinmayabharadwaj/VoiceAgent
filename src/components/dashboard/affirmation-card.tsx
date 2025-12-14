'use client';

import { getAffirmation } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useTransition } from "react";
import { RefreshCw, Zap } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInVariants, scaleInVariants } from "@/lib/animations";

export function AffirmationCard() {
    const [affirmation, setAffirmation] = useState('');
    const [isPending, startTransition] = useTransition();
    const [key, setKey] = useState(0);

    const fetchAffirmation = () => {
        startTransition(async () => {
            const result = await getAffirmation({});
            setAffirmation(result);
            setKey(prev => prev + 1);
        });
    };

    useEffect(() => {
        fetchAffirmation();
    }, []);

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="bg-accent/20 border-accent/30 hover:shadow-lg transition-shadow overflow-hidden relative">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5"
                    animate={{
                        x: ['-100%', '100%']
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                />
                <CardContent className="p-6 relative">
                    <motion.div 
                        className="flex items-center gap-2 mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            animate={{ 
                                rotate: [0, 10, -10, 10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                        >
                            <Zap className="text-accent-foreground" />
                        </motion.div>
                        <h3 className="text-lg font-bold text-accent-foreground font-headline">Daily Affirmation</h3>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {isPending && !affirmation ? (
                            <motion.div 
                                key="skeleton"
                                className="space-y-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ 
                                    duration: 0.5,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                            >
                                <p className="text-2xl font-medium min-h-[5rem]">
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        "
                                    </motion.span>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                    >
                                        {affirmation}
                                    </motion.span>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        "
                                    </motion.span>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={fetchAffirmation} 
                            disabled={isPending} 
                            className="mt-4"
                        >
                            <motion.div
                                animate={isPending ? { rotate: 360 } : { rotate: 0 }}
                                transition={isPending ? { 
                                    duration: 1, 
                                    repeat: Infinity, 
                                    ease: 'linear' 
                                } : { duration: 0.3 }}
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                            </motion.div>
                            New Affirmation
                        </Button>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
