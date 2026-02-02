'use client';

import { PageHeader } from '@/components/layout/page-header';
import { StoryCompletionGame } from '@/components/games/story-completion-game';
import { ChooseYourFeelingsGame } from '@/components/games/choose-your-feelings-game';
import { CalmPulseGame } from '@/components/games/calm-pulse-game';
import { FocusChallengeGame } from '@/components/games/focus-challenge-game';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/contexts/language-context';

export default function GamesPage() {
  const { t } = useLanguage();
  
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader breadcrumbs={[{ href: '/', label: t('nav.dashboard') }, { label: t('nav.games') }]} />
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-headline">{t('games.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('games.subtitle')}
          </p>
        </div>

        <Tabs defaultValue="story-completion">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 mx-auto max-w-3xl">
            <TabsTrigger value="story-completion">Story Completion</TabsTrigger>
            <TabsTrigger value="choose-your-feelings">Choose Your Feelings</TabsTrigger>
            <TabsTrigger value="calm-pulse">Calm Pulse</TabsTrigger>
            <TabsTrigger value="focus-challenge">Focus Challenge</TabsTrigger>
          </TabsList>
          
          <div className="mt-8 flex justify-center">
              <div className="w-full max-w-2xl">
                  <TabsContent value="story-completion">
                      <StoryCompletionGame />
                  </TabsContent>
                  <TabsContent value="choose-your-feelings">
                      <ChooseYourFeelingsGame />
                  </TabsContent>
                  <TabsContent value="calm-pulse">
                      <CalmPulseGame />
                  </TabsContent>
                  <TabsContent value="focus-challenge">
                      <FocusChallengeGame />
                  </TabsContent>
              </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
