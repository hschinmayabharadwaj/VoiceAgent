import { PageHeader } from '@/components/layout/page-header';
import { ChatInterface } from "@/components/chat/chat-interface";

export default function ChatPage() {
    return (
        <div className="flex-1 flex flex-col">
            <PageHeader breadcrumbs={[{ href: '/', label: 'Dashboard' }, { label: 'Chat Bot' }]} />
            <div className="flex-1 flex flex-col">
                <ChatInterface />
            </div>
        </div>
    );
}
