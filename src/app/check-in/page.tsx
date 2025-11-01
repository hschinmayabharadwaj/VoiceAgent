import { PageHeader } from '@/components/layout/page-header';
import { CheckInFlow } from "@/components/check-in/check-in-flow";

export default function CheckInPage() {
    return (
        <div className="flex-1 flex flex-col">
            <PageHeader breadcrumbs={[{ href: '/', label: 'Dashboard' }, { label: 'Daily Check-in' }]} />
            <div className="flex-1 container mx-auto max-w-2xl py-8 px-4">
                <CheckInFlow />
            </div>
        </div>
    );
}
