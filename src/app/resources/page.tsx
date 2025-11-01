import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Wind, Ear } from "lucide-react";

const resources = [
  {
    title: "Guided Meditation",
    description: "Follow along with guided meditations to calm your mind and reduce stress.",
    icon: BrainCircuit,
  },
  {
    title: "Breathing Exercises",
    description: "Learn simple breathing techniques to manage anxiety and find your center.",
    icon: Wind,
  },
  {
    title: "Active Listening Guide",
    description: "Improve your communication skills and build stronger connections with others.",
    icon: Ear,
  },
    {
    title: "Understanding Emotions",
    description: "Explore articles that help you identify and understand what you are feeling.",
    icon: BrainCircuit,
  },
];

export default function ResourcesPage() {
    return (
        <div className="flex-1 flex flex-col">
            <PageHeader breadcrumbs={[{ href: '/', label: 'Dashboard' }, { label: 'Resources' }]} />
            <div className="flex-1 p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-2 font-headline">Wellness Resources</h1>
                <p className="text-lg text-muted-foreground mb-8">Tools and guides to support your mental well-being.</p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {resources.map((resource) => (
                        <Card key={resource.title}>
                            <CardHeader className="flex-row items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <resource.icon className="w-6 h-6" />
                                </div>
                                <CardTitle>{resource.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{resource.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
