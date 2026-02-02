// src/app/motion-arcade/page.tsx
'use client';

import React from 'react';
import GestureShooterGame from '../../components/games/gesture-shooter-game';
import { PageHeader } from '@/components/layout/page-header';
import { useLanguage } from '@/contexts/language-context';

export default function MotionArcadePage() {
  const { t } = useLanguage();
  
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader breadcrumbs={[{ href: '/', label: t('nav.dashboard') }, { label: t('nav.motionArcade') }]} />
      <div className="flex flex-col flex-1 bg-sidebar p-8 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-headline">{t('nav.motionArcade')}</h1>
          <p className="text-muted-foreground">Engage your body and mind with gesture-controlled gaming.</p>
        </div>
        <GestureShooterGame />
      </div>
    </div>
  );
}