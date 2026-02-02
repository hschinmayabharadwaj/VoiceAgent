'use client';

import { PageHeader } from '@/components/layout/page-header';
import { CheckInFlow } from "@/components/check-in/check-in-flow";
import { useLanguage } from '@/contexts/language-context';

export default function CheckInPage() {
    const { t } = useLanguage();
    
    return (
        <div className="flex-1 flex flex-col">
            <PageHeader breadcrumbs={[{ href: '/', label: t('nav.dashboard') }, { label: t('nav.checkin') }]} />
            <div className="flex-1 container mx-auto max-w-2xl py-8 px-4">
                <CheckInFlow />
            </div>
        </div>
    );
}
