'use client';

import { PageHeader } from '@/components/layout/page-header';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { AffirmationCard } from '@/components/dashboard/affirmation-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BookHeart, LineChart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants, cardHoverVariants } from '@/lib/animations';

export default function Home() {
  return (
    <motion.div 
      className="flex-1 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader breadcrumbs={[{ label: 'Dashboard' }]} />
      <motion.div 
        className="flex-1 flex flex-col gap-8 p-4 md:p-8"
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={staggerItemVariants}>
          <WelcomeHeader />
        </motion.div>
        
        <motion.div 
          className="grid gap-8 md:grid-cols-2"
          variants={staggerContainerVariants}
        >
          <motion.div variants={staggerItemVariants}>
            <AffirmationCard />
          </motion.div>
          
          <motion.div 
            variants={staggerItemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="flex flex-col items-center justify-center p-8 text-center h-full hover:shadow-lg transition-shadow">
              <motion.h3 
                className="text-2xl font-bold mb-4 font-headline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                How are you feeling today?
              </motion.h3>
              <motion.p 
                className="mb-6 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Take a moment to check in with yourself. It only takes a minute.
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg">
                  <Link href="/check-in">
                    Start Daily Check-in <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="grid gap-8 md:grid-cols-2"
          variants={staggerContainerVariants}
        >
          <motion.div 
            variants={staggerItemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center gap-6">
                <motion.div 
                  className="p-3 bg-accent/20 rounded-lg text-accent-foreground"
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <LineChart className="w-8 h-8"/>
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold mb-1 font-headline">Track Your Progress</h3>
                  <p className="text-sm text-muted-foreground mb-4">See your mood trends and celebrate your journey.</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" asChild>
                      <Link href="/progress" className="group">
                        View Progress <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1"/>
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            variants={staggerItemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center gap-6">
                <motion.div 
                  className="p-3 bg-secondary rounded-lg text-secondary-foreground"
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <BookHeart className="w-8 h-8"/>
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold mb-1 font-headline">Explore Resources</h3>
                  <p className="text-sm text-muted-foreground mb-4">Find articles, exercises, and support tools.</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" asChild>
                      <Link href="/resources" className="group">
                        Browse Resources <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1"/>
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
