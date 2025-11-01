import { PageHeader } from '@/components/layout/page-header';
import { PostCard } from "@/components/forum/post-card";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { type Post } from "@/lib/types";

const mockPosts: Post[] = [
  {
    id: "1",
    author: "Anonymous Panda",
    title: "Feeling overwhelmed with school work",
    content: "Lately, the pressure from school has been too much. I feel like I can't keep up and it's making me really anxious. Does anyone else feel this way? How do you cope?",
    comments: 5,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    author: "Anonymous Capybara",
    title: "A small win today!",
    content: "I've been struggling to get out of bed, but today I managed to go for a short walk and it felt really good. Just wanted to share a small moment of positivity.",
    comments: 12,
    timestamp: "8 hours ago",
  },
  {
    id: "3",
    author: "Anonymous Fox",
    title: "How to deal with feeling lonely?",
    content: "I moved to a new city and I'm finding it hard to make friends. It gets really lonely sometimes. Any advice on meeting new people or dealing with loneliness?",
    comments: 8,
    timestamp: "1 day ago",
  },
];


export default function ForumPage() {
    return (
        <div className="flex-1 flex flex-col">
            <PageHeader breadcrumbs={[{ href: '/', label: 'Dashboard' }, { label: 'Forum' }]} />
            <div className="flex-1 p-4 md:p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Support Forum</h1>
                        <p className="text-lg text-muted-foreground">A safe and anonymous space to share and connect.</p>
                    </div>
                    <Button>
                        <PenSquare className="mr-2 h-4 w-4" />
                        Create Post
                    </Button>
                </div>
                <div className="space-y-6">
                    {mockPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
}
