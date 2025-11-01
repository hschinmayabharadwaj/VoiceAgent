import { PageHeader } from '@/components/layout/page-header';
import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { AffirmationCard } from '@/components/dashboard/affirmation-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BookHeart, LineChart } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader breadcrumbs={[{ label: 'Dashboard' }]} />
      <div className="flex-1 flex flex-col gap-8 p-4 md:p-8">
        <WelcomeHeader />
        <div className="grid gap-8 md:grid-cols-2">
          <AffirmationCard />
          <Card className="flex flex-col items-center justify-center p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 font-headline">How are you feeling today?</h3>
              <p className="mb-6 text-muted-foreground">Take a moment to check in with yourself. It only takes a minute.</p>
              <Button asChild size="lg">
                  <Link href="/check-in">
                      Start Daily Check-in <ArrowRight />
                  </Link>
              </Button>
          </Card>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
              <CardContent className="p-6 flex items-center gap-6">
                  <div className="p-3 bg-accent/20 rounded-lg text-accent-foreground"><LineChart className="w-8 h-8"/></div>
                  <div>
                      <h3 className="text-lg font-bold mb-1 font-headline">Track Your Progress</h3>
                      <p className="text-sm text-muted-foreground mb-4">See your mood trends and celebrate your journey.</p>
                      <Button variant="outline" asChild>
                          <Link href="/progress">View Progress <ArrowRight/></Link>
                      </Button>
                  </div>
              </CardContent>
          </Card>
          <Card>
              <CardContent className="p-6 flex items-center gap-6">
                  <div className="p-3 bg-secondary rounded-lg text-secondary-foreground"><BookHeart className="w-8 h-8"/></div>
                  <div>
                      <h3 className="text-lg font-bold mb-1 font-headline">Explore Resources</h3>
                      <p className="text-sm text-muted-foreground mb-4">Find articles, exercises, and support tools.</p>
                      <Button variant="outline" asChild>
                          <Link href="/resources">Browse Resources <ArrowRight/></Link>
                      </Button>
                  </div>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
