'use client';

import { PageHeader } from '@/components/layout/page-header';
import { MoodChart } from "@/components/progress/mood-chart";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useLanguage } from '@/contexts/language-context';

export default function ProgressPage() {
    const { t } = useLanguage();
    
    return (
        <div className="flex-1 flex flex-col">
            <PageHeader breadcrumbs={[{ href: '/', label: t('nav.dashboard') }, { label: t('nav.progress') }]} />
            <div className="flex-1 p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-2 font-headline">{t('progress.title')}</h1>
                <p className="text-lg text-muted-foreground mb-8">{t('progress.subtitle')}</p>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('progress.moodTrends')}</CardTitle>
                        <CardDescription>{t('progress.moodTrendsDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <MoodChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
