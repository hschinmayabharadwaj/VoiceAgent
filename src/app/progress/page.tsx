import { PageHeader } from '@/components/layout/page-header';
import { MoodChart } from "@/components/progress/mood-chart";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function ProgressPage() {
    return (
        <div className="flex-1 flex flex-col">
            <PageHeader breadcrumbs={[{ href: '/', label: 'Dashboard' }, { label: 'My Progress' }]} />
            <div className="flex-1 p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-2 font-headline">Your Wellness Journey</h1>
                <p className="text-lg text-muted-foreground mb-8">Visualize your mood trends over time.</p>
                <Card>
                    <CardHeader>
                        <CardTitle>Mood Trends</CardTitle>
                        <CardDescription>Showing your mood scores from the last 30 check-ins.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <MoodChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
