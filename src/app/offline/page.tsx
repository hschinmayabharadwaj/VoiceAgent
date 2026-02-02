import { OfflinePage } from '@/components/offline/offline-banner';

export default function Offline() {
  return <OfflinePage />;
}

// This ensures the page is statically generated
export const dynamic = 'force-static';
